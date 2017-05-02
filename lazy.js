(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return factory(root);
		});
	} else if (typeof exports === 'object') {
		module.exports = factory;
	} else {
		root.lazyUIT = factory(root);
	}
})(this, function (root) {

	'use strict';

	var lazyUIT = {};

	var callback = function () {};

	var errorSrc = 'img url on error';// errorSrc Default

	var offset, poll, delay, useDebounce, unload;

	var isHidden = function (element) {
		return (element.offsetParent === null);
	};

	var inView = function (element, view) {
		if (isHidden(element)) {
			return false;
		}

		var box = element.getBoundingClientRect();
		return (box.right >= view.l && box.bottom >= view.t && box.left <= view.r && box.top <= view.b);
	};

	var debounceOrThrottle = function () {
		if(!useDebounce && !!poll) {
			return;
		}
		clearTimeout(poll);
		poll = setTimeout(function(){
			lazyUIT.render();
			poll = null;
		}, delay);
	};

	lazyUIT.image = function (opts) {
		opts = opts || {};
		var offsetAll = opts.offset || 0;// offset Default: 0
		var offsetVertical = opts.offsetVertical || offsetAll;
		var offsetHorizontal = opts.offsetHorizontal || offsetAll;
		var optionToInt = function (opt, fallback) {
			return parseInt(opt || fallback, 10);
		};
		offset = {
			t: optionToInt(opts.offsetTop, offsetVertical),
			b: optionToInt(opts.offsetBottom, offsetVertical),
			l: optionToInt(opts.offsetLeft, offsetHorizontal),
			r: optionToInt(opts.offsetRight, offsetHorizontal)
		};
		delay = optionToInt(opts.throttle, 50); // throttle Default: 50
		useDebounce = opts.debounce !== false;
		unload = !!opts.unload;
		callback = opts.callback || callback;
		errorSrc = opts.errorSrc || errorSrc;
		lazyUIT.render();
		if (document.addEventListener) {
			root.addEventListener('scroll', debounceOrThrottle, false);
			root.addEventListener('load', debounceOrThrottle, false);
		} else {
			root.attachEvent('onscroll', debounceOrThrottle);
			root.attachEvent('onload', debounceOrThrottle);
		}
	};

	lazyUIT.render = function (context) {
		var imgError = function (elem) {
			elem.onerror= function() {
				var src = elem.getAttribute('src');
				elem.src = errorSrc;
			}
		};
		var nodes = (context || document).querySelectorAll('[data-original], [data-bg-original], .lazyBg');
		var length = nodes.length;
		var src, elem;
		var view = {
			l: 0 - offset.l,
			t: 0 - offset.t,
			b: (root.innerHeight || document.documentElement.clientHeight) + offset.b,
			r: (root.innerWidth || document.documentElement.clientWidth) + offset.r
		};
		for (var i = 0; i < length; i++) {
			elem = nodes[i];
			if (inView(elem, view)) {
				if (elem.getAttribute('data-bg-original') !== null) {
					elem.style.backgroundImage = 'url(' + elem.getAttribute('data-bg-original') + ')';
				}
				else if (elem.src !== (src = elem.getAttribute('data-original'))) {
					elem.src = src;
				}

				var classNames=(" " + elem.className + " ").replace(/[\n\t]/g, " ");
				if ( classNames.indexOf(" lazyBg ") > -1 ) {
					elem.className = classNames.replace(" lazyBg ", " ");
				}

				if (!unload) {
					elem.removeAttribute('data-original');
					elem.removeAttribute('data-bg-original');
				}
				callback(elem, 'load');
				imgError(elem);
			}
		}
		if (!length) {
			lazyUIT.detach();
		}
	};

	lazyUIT.detach = function () {
		if (document.removeEventListener) {
			root.removeEventListener('scroll', debounceOrThrottle);
		} else {
			root.detachEvent('onscroll', debounceOrThrottle);
		}
		clearTimeout(poll);
	};

	lazyUIT.js = function(url, callback) {
		if (url == null) {
			return false;
		}
		var scriptEle = document.createElement('script');
		scriptEle.type = 'text/javascript';
		var loaded = false;
		scriptEle.onreadystatechange = function () {
			if (this.readyState == 'loaded' || this.readyState == 'complete') {
				if (loaded) return;
				loaded = true;
				callback();
			}
		}
		scriptEle.onload = function () {
			callback();
		};
		scriptEle.src = url;
		document.getElementsByTagName('head')[0].appendChild(scriptEle);
	}

	lazyUIT.youTube = function(ele) {
		ele = ele || '.lazyYoutube';

		var nodes = document.querySelectorAll(ele),
			l = nodes.length, i, elem, youTubeIfr, options;

		for(i=0; i<l; i++) {
			elem = nodes[i];
			youTubeIfr = document.createElement('iframe');
			options = JSON.parse(elem.getAttribute('data-options')) || {};

			var srcValue=elem.getAttribute('data-src');
			if (!(srcValue==null)&&!(srcValue=="")) {
				youTubeIfr.setAttribute('src', elem.getAttribute('data-src'));
				youTubeIfr.setAttribute('allowfullscreen', '');

				for (var key in options) {
					youTubeIfr.setAttribute(key, options[key]);
				}

				elem.appendChild(youTubeIfr);
				//console.log('ok:', srcValue);
			}
			// else {
			// 	console.log('error');
			// }
		}
	}

	return lazyUIT;

});

/* thx to Meraseu!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
