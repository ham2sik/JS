(function (root, factory) {
	root.jk=factory(root);
})(this, function (root) {

	'use strict';

	var core = {};

	// UserAgent
	function detect(ua) {

		function getFirstMatch(regex) {
			var match = ua.match(regex);
			return (match && match.length > 1 && match[1]) || '';
		}

		function getSecondMatch(regex) {
			var match = ua.match(regex);
			return (match && match.length > 1 && match[2]) || '';
		}

		var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase(),
			likeAndroid = /like android/i.test(ua),
			android = !likeAndroid && /android/i.test(ua),
			nexusMobile = /nexus\s*[0-6]\s*/i.test(ua),
			nexusTablet = !nexusMobile && /nexus\s*[0-9]+/i.test(ua),
			chromeos = /CrOS/.test(ua),
			silk = /silk/i.test(ua),
			sailfish = /sailfish/i.test(ua),
			tizen = /tizen/i.test(ua),
			webos = /(web|hpw)os/i.test(ua),
			windowsphone = /windows phone/i.test(ua),
			samsungBrowser = /SamsungBrowser/i.test(ua),
			windows = !windowsphone && /windows/i.test(ua),
			mac = !iosdevice && !silk && /macintosh/i.test(ua),
			linux = !android && !sailfish && !tizen && !webos && /linux/i.test(ua),
			edgeVersion = getFirstMatch(/edge\/(\d+(\.\d+)?)/i),
			versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i),
			tablet = /tablet/i.test(ua),
			mobile = !tablet && /[^-]mobi/i.test(ua),
			xbox = /xbox/i.test(ua),
			result;

		if (/opera/i.test(ua)) {
			//  an old Opera
			result = {
				name: 'Opera',
				opera: true,
				version: versionIdentifier || getFirstMatch(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)
			}
		} else if (/opr|opios/i.test(ua)) {
			// a new Opera
			result = {
				name: 'Opera',
				opera: true,
				version: getFirstMatch(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || versionIdentifier
			}
		} else if (/SamsungBrowser/i.test(ua)) {
			result = {
				name: 'Samsung Internet for Android',
				samsungBrowser: true,
				version: versionIdentifier || getFirstMatch(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)
			}
		} else if (/coast/i.test(ua)) {
			result = {
				name: 'Opera Coast',
				coast: true,
				version: versionIdentifier || getFirstMatch(/(?:coast)[\s\/](\d+(\.\d+)?)/i)
			}
		} else if (/yabrowser/i.test(ua)) {
			result = {
				name: 'Yandex Browser',
				yandexbrowser: true,
				version: versionIdentifier || getFirstMatch(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
			}
		} else if (/ucbrowser/i.test(ua)) {
			result = {
				name: 'UC Browser',
				ucbrowser: true,
				version: getFirstMatch(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i)
			}
		} else if (/mxios/i.test(ua)) {
			result = {
				name: 'Maxthon',
				maxthon: true,
				version: getFirstMatch(/(?:mxios)[\s\/](\d+(?:\.\d+)+)/i)
			}
		} else if (/epiphany/i.test(ua)) {
			result = {
				name: 'Epiphany',
				epiphany: true,
				version: getFirstMatch(/(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i)
			}
		} else if (/puffin/i.test(ua)) {
			result = {
				name: 'Puffin',
				puffin: true,
				version: getFirstMatch(/(?:puffin)[\s\/](\d+(?:\.\d+)?)/i)
			}
		} else if (/sleipnir/i.test(ua)) {
			result = {
				name: 'Sleipnir',
				sleipnir: true,
				version: getFirstMatch(/(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i)
			}
		} else if (/k-meleon/i.test(ua)) {
			result = {
				name: 'K-Meleon',
				kMeleon: true,
				version: getFirstMatch(/(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i)
			}
		} else if (windowsphone) {
			result = {
				name: 'Windows Phone',
				windowsphone: true
			}
			if (edgeVersion) {
				result.msedge = true
				result.version = edgeVersion
			} else {
				result.msie = true
				result.version = getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i)
			}
		} else if (/msie|trident/i.test(ua)) {
			result = {
				name: 'Internet Explorer',
				msie: true,
				version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
			}
		} else if (chromeos) {
			result = {
				name: 'Chrome',
				chromeos: true,
				chromeBook: true,
				chrome: true,
				version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
			}
		} else if (/chrome.+? edge/i.test(ua)) {
			result = {
				name: 'Microsoft Edge',
				msedge: true,
				version: edgeVersion
			}
		} else if (/vivaldi/i.test(ua)) {
			result = {
				name: 'Vivaldi',
				vivaldi: true,
				version: getFirstMatch(/vivaldi\/(\d+(\.\d+)?)/i) || versionIdentifier
			}
		} else if (sailfish) {
			result = {
				name: 'Sailfish',
				sailfish: true,
				version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
			}
		} else if (/seamonkey\//i.test(ua)) {
			result = {
				name: 'SeaMonkey',
				seamonkey: true,
				version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
			}
		} else if (/firefox|iceweasel|fxios/i.test(ua)) {
			result = {
				name: 'Firefox',
				firefox: true,
				version: getFirstMatch(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)
			}
			if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
				result.firefoxos = true
			}
		} else if (silk) {
			result =  {
				name: 'Amazon Silk',
				silk: true,
				version : getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
			}
		} else if (/phantom/i.test(ua)) {
			result = {
				name: 'PhantomJS',
				phantom: true,
				version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
			}
		} else if (/slimerjs/i.test(ua)) {
			result = {
				name: 'SlimerJS',
				slimer: true,
				version: getFirstMatch(/slimerjs\/(\d+(\.\d+)?)/i)
			}
		} else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
			result = {
				name: 'BlackBerry',
				blackberry: true,
				version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
			}
		} else if (webos) {
			result = {
				name: 'WebOS',
				webos: true,
				version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
			};
			/touchpad\//i.test(ua) && (result.touchpad = true)
		} else if (/bada/i.test(ua)) {
			result = {
				name: 'Bada',
				bada: true,
				version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
			};
		} else if (tizen) {
			result = {
				name: 'Tizen',
				tizen: true,
				version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
			};
		} else if (/qupzilla/i.test(ua)) {
			result = {
				name: 'QupZilla',
				qupzilla: true,
				version: getFirstMatch(/(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i) || versionIdentifier
			}
		} else if (/chromium/i.test(ua)) {
			result = {
				name: 'Chromium',
				chromium: true,
				version: getFirstMatch(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || versionIdentifier
			}
		} else if (/chrome|crios|crmo/i.test(ua)) {
			result = {
				name: 'Chrome',
				chrome: true,
				version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
			}
		} else if (android) {
			result = {
				name: 'Android',
				version: versionIdentifier
			}
		} else if (/safari|applewebkit/i.test(ua)) {
			result = {
				name: 'Safari',
				safari: true
			}
			if (versionIdentifier) {
				result.version = versionIdentifier
			}
		} else if (iosdevice) {
			result = {
				name : iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
			}
			// WTF: version is not part of user agent in web apps
			if (versionIdentifier) {
				result.version = versionIdentifier
			}
		} else if(/googlebot/i.test(ua)) {
			result = {
				name: 'Googlebot',
				googlebot: true,
				version: getFirstMatch(/googlebot\/(\d+(\.\d+))/i) || versionIdentifier
			}
		} else {
			result = {
				name: getFirstMatch(/^(.*)\/(.*) /),
				version: getSecondMatch(/^(.*)\/(.*) /)
			};
		}

		// set webkit or gecko flag for browsers based on these engines
		if (!result.msedge && /(apple)?webkit/i.test(ua)) {
			if (/(apple)?webkit\/537\.36/i.test(ua)) {
				result.name = result.name || "Blink";
				result.blink = true;
			} else {
				result.name = result.name || "Webkit";
				result.webkit = true;
			}
			if (!result.version && versionIdentifier) {
				result.version = versionIdentifier
			}
		} else if (!result.opera && /gecko\//i.test(ua)) {
			result.name = result.name || "Gecko";
			result.gecko = true;
			result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i);
		}

		// set OS flags for platforms that have multiple browsers
		if (!result.windowsphone && !result.msedge && (android || result.silk)) {
			result.android = true;
			result.osname = 'Android';
		} else if (!result.windowsphone && !result.msedge && iosdevice) {
			result[iosdevice] = true;
			result.ios = true;
			result.osname = iosdevice;
		} else if (mac) {
			result.mac = true;
			result.osname = 'Mac';
		} else if (xbox) {
			result.xbox = true;
			result.osname = 'Xbox';
		} else if (windows) {
			result.windows = true;
			result.osname = 'Windows';
		} else if (linux) {
			result.linux = true;
			result.osname = 'Linux';
		}

		function getWindowsVersion (s) {
			switch (s) {
				case 'NT': return 'NT'
				case 'XP': return 'XP'
				case 'NT 5.0': return '2000'
				case 'NT 5.1': return 'XP'
				case 'NT 5.2': return '2003'
				case 'NT 6.0': return 'Vista'
				case 'NT 6.1': return '7'
				case 'NT 6.2': return '8'
				case 'NT 6.3': return '8.1'
				case 'NT 10.0': return '10'
				default: return undefined
			}
		}
		
		// OS version extraction
		var osVersion = '';
		if (result.windows) {
			osVersion = getWindowsVersion(getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i))
		} else if (result.windowsphone) {
			osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
		} else if (result.mac) {
			osVersion = getFirstMatch(/Mac OS X (\d+([_\.\s]\d+)*)/i);
			osVersion = osVersion.replace(/[_\s]/g, '.');
		} else if (iosdevice) {
			osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
			osVersion = osVersion.replace(/[_\s]/g, '.');
		} else if (android) {
			osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
		} else if (result.webos) {
			osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
		} else if (result.blackberry) {
			osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
		} else if (result.bada) {
			osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
		} else if (result.tizen) {
			osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
		}
		if (osVersion) {
			result.osversion = osVersion;
		}

		// device type extraction
		var osMajorVersion = !result.windows && osVersion.split('.')[0];
		if (tablet || nexusTablet || iosdevice == 'ipad' || (android && (osMajorVersion == 3 || (osMajorVersion >= 4 && !mobile))) || result.silk) {
			result.tablet = true;
		} else if (mobile || iosdevice == 'iphone' || iosdevice == 'ipod' || android || nexusMobile || result.blackberry || result.webos || result.bada) {
			result.mobile = true;
		}

		result.info = result.osname + ' ' + result.osversion + ', ' + result.name + ' ' + result.version;

		return result
	}
	var browser = core.browser = detect(typeof navigator !== 'undefined' ? navigator.userAgent || '' : '');

	// init
	var init = core.init = function() {
		// [ES6] Object.assign() Polyfill - https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
		if (typeof Object.assign != 'function') {
			console.log("Object.assign Polyfill use");
			Object.assign = function(target, varArgs) {
				if (target == null) { // TypeError if undefined or null
					throw new TypeError('Cannot convert undefined or null to object');
				}

				var to = Object(target);

				for (var index = 1; index < arguments.length; index++) {
					var nextSource = arguments[index];

					if (nextSource != null) { // Skip over if undefined or null
						for (var nextKey in nextSource) {
							// Avoid bugs when hasOwnProperty is shadowed
							if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
								to[nextKey] = nextSource[nextKey];
							}
						}
					}
				}
				return to;
			};
		}
	}

	core.init();

	return core;
});


// [ES6] Promise Polyfill - https://github.com/taylorhakes/promise-polyfill/blob/master/promise.js
(function (root) {

	// Store setTimeout reference so promise-polyfill will be unaffected by
	// other code modifying setTimeout (like sinon.useFakeTimers())
	var setTimeoutFunc = setTimeout;

	function noop() {}

	// Polyfill for Function.prototype.bind
	function bind(fn, thisArg) {
		return function () {
			fn.apply(thisArg, arguments);
		};
	}

	function Promise(fn) {
		if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
		if (typeof fn !== 'function') throw new TypeError('not a function');
		this._state = 0;
		this._handled = false;
		this._value = undefined;
		this._deferreds = [];

		doResolve(fn, this);
	}

	function handle(self, deferred) {
		while (self._state === 3) {
			self = self._value;
		}
		if (self._state === 0) {
			self._deferreds.push(deferred);
			return;
		}
		self._handled = true;
		Promise._immediateFn(function () {
			var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
			if (cb === null) {
				(self._state === 1 ? resolve : reject)(deferred.promise, self._value);
				return;
			}
			var ret;
			try {
				ret = cb(self._value);
			} catch (e) {
				reject(deferred.promise, e);
				return;
			}
			resolve(deferred.promise, ret);
		});
	}

	function resolve(self, newValue) {
		try {
			// Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
			if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
			if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
				var then = newValue.then;
				if (newValue instanceof Promise) {
					self._state = 3;
					self._value = newValue;
					finale(self);
					return;
				} else if (typeof then === 'function') {
					doResolve(bind(then, newValue), self);
					return;
				}
			}
			self._state = 1;
			self._value = newValue;
			finale(self);
		} catch (e) {
			reject(self, e);
		}
	}

	function reject(self, newValue) {
		self._state = 2;
		self._value = newValue;
		finale(self);
	}

	function finale(self) {
		if (self._state === 2 && self._deferreds.length === 0) {
			Promise._immediateFn(function() {
				if (!self._handled) {
					Promise._unhandledRejectionFn(self._value);
				}
			});
		}

		for (var i = 0, len = self._deferreds.length; i < len; i++) {
			handle(self, self._deferreds[i]);
		}
		self._deferreds = null;
	}

	function Handler(onFulfilled, onRejected, promise) {
		this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
		this.onRejected = typeof onRejected === 'function' ? onRejected : null;
		this.promise = promise;
	}

	/**
	* Take a potentially misbehaving resolver function and make sure
	* onFulfilled and onRejected are only called once.
	*
	* Makes no guarantees about asynchrony.
	*/
	function doResolve(fn, self) {
		var done = false;
		try {
			fn(function (value) {
				if (done) return;
				done = true;
				resolve(self, value);
			}, function (reason) {
				if (done) return;
				done = true;
				reject(self, reason);
			});
		} catch (ex) {
			if (done) return;
			done = true;
			reject(self, ex);
		}
	}

	Promise.prototype['catch'] = function (onRejected) {
		return this.then(null, onRejected);
	};

	Promise.prototype.then = function (onFulfilled, onRejected) {
		var prom = new (this.constructor)(noop);

		handle(this, new Handler(onFulfilled, onRejected, prom));
		return prom;
	};

	Promise.all = function (arr) {
		var args = Array.prototype.slice.call(arr);

		return new Promise(function (resolve, reject) {
			if (args.length === 0) return resolve([]);
			var remaining = args.length;

			function res(i, val) {
				try {
					if (val && (typeof val === 'object' || typeof val === 'function')) {
						var then = val.then;
						if (typeof then === 'function') {
							then.call(val, function (val) {
								res(i, val);
							}, reject);
							return;
						}
					}
					args[i] = val;
					if (--remaining === 0) {
						resolve(args);
					}
				} catch (ex) {
					reject(ex);
				}
			}

			for (var i = 0; i < args.length; i++) {
				res(i, args[i]);
			}
		});
	};

	Promise.resolve = function (value) {
		if (value && typeof value === 'object' && value.constructor === Promise) {
			return value;
		}

		return new Promise(function (resolve) {
			resolve(value);
		});
	};

	Promise.reject = function (value) {
		return new Promise(function (resolve, reject) {
			reject(value);
		});
	};

	Promise.race = function (values) {
		return new Promise(function (resolve, reject) {
			for (var i = 0, len = values.length; i < len; i++) {
				values[i].then(resolve, reject);
			}
		});
	};

	// Use polyfill for setImmediate for performance gains
	Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
		function (fn) {
			setTimeoutFunc(fn, 0);
		};

	Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
		if (typeof console !== 'undefined' && console) {
			console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
		}
	};

	/**
	* Set the immediate function to execute callbacks
	* @param fn {function} Function to execute
	* @deprecated
	*/
	Promise._setImmediateFn = function _setImmediateFn(fn) {
		Promise._immediateFn = fn;
	};

	/**
	* Change the function to execute on unhandled rejection
	* @param {function} fn Function to execute on unhandled rejection
	* @deprecated
	*/
	Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
		Promise._unhandledRejectionFn = fn;
	};

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Promise;
	} else if (!root.Promise) {
		console.log("Promise Polyfill use");
		root.Promise = Promise;
	}

})(this);


// uit test
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jQuery'],factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jQuery'));
	} else {
		root.uit = Object.assign((root.uit || {}), factory(jQuery));
	}
})(this, function ($) {
	'use strict';

	var uit = {};

	// layer popup
	var layer = uit.layer = function(origin, options, container) {
		if (!origin) {
			return false;
		}
		if (!container) {
			container = '#layer'; // default id
		}
		var defaults = {
			styleClass : '.layer', // layer popup style class
			closeButton : '.layer-btn-close',
			dimmedClickable : true,
			wrapper : '.layer-wrap',
			content : '.layer-content'
			// ajax : 'url' - optional
		};
		var c = this,
			o = Object.assign({}, defaults, options),
			$container = $(container),
			$wrapper, $content, $closeButton;

		c.event = {
			clickClose : function() {
				$closeButton.on('click.clickClose', c.close);
				$container.focus(); // 접근성
				if (o.dimmedClickable) {
					$wrapper.on('click.clickDimmed', c.close);
					$content.on('click.clickDimmed', function(event) {
						event.stopPropagation();
					});
				}
			},
		}

		c.close = function () {
			$closeButton.off('click.clickClose');
			if (o.dimmedClickable) {
				$wrapper.off('click.clickDimmed');
				$content.off('click.clickDimmed');
			}
			$container.removeClass(o.styleClass);
			$(origin).focus(); // 접근성
		}

		if ($container.length <= 0) {
			var contDiv = document.createElement('div');
			contDiv.id = container.replace('#','');
			contDiv.className = o.styleClass.replace('.','');
			contDiv.tabIndex = '0';
			document.body.appendChild(contDiv);
			$container = $(container);
		} else {
			$container.addClass(o.styleClass);
		}

		if ((o.ajax)&&($container.attr('data-ajax')!==o.ajax)) {
			$.ajax({
				type: "GET",
				url: o.ajax,
				success: function(data) {
					$container.html(data);
					$container.attr('data-ajax', o.ajax);
					$closeButton = $container.find(o.closeButton);
					if (o.dimmedClickable) {
						$wrapper = $container.find(o.wrapper);
						$content = $container.find(o.content);
					}
					c.event.clickClose();
				}
			});
		} else {
			$closeButton = $container.find(o.closeButton);
			if (o.dimmedClickable) {
				$wrapper = $container.find(o.wrapper);
				$content = $container.find(o.content);
			}
			c.event.clickClose();
		}
	}

	return uit;
});
