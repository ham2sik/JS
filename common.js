(function($){
	$.fn.extend({
		byteCheck: function(options) {// plugin name
			var defaults={//Settings list and the default values
					spanClass : 'byte',
					max : 150
				},
				options=$.extend(defaults, options);
			function stringByteLength(s,b,i,c) {
				for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
				return b;
			}
			return this.each(function() {
				var o=options,
					$this=$(this),
					$textarea=$this.find('textarea'),
					$byteTxt=$this.find('.'+o.spanClass+' strong'),
					maxValue=o.max,
					string,
					stringLength,
					overLength;
				$textarea.on('keyup',function() {
					string=$textarea.val();
					stringLength=stringByteLength(string);
					if (stringLength > maxValue) {
						overLength=string.length;
						while (stringLength > maxValue) {
							string=string.substr(0, overLength--);
							stringLength=stringByteLength(string);
						}
						$textarea.val(string);
						$byteTxt.text(stringLength);
						alert(maxValue+"byte를 초과하였습니다.");
					} else {
						$byteTxt.text(stringLength);
					}
				});
			});
		},
		checkbox: function(options) {
			var defaults={
					imgClass : 'tplBtn',
					onClass : 'chk'
				},
				options=$.extend(defaults, options);
			return this.each(function() {
				var o=options,
					$this=$(this),
					$input=$this.find('input[type="checkbox"]'),
					$img=$this.find('.'+o.imgClass),
					onClassName=o.onClass;
				if ($img.prop('tagName').toLowerCase()!='span') {
					$input.on('click', function(e) {
						$img.toggleClass(onClassName);
					});
				} else {
					$this.on('click', function(e) {
						if ($img.hasClass(onClassName)) {
							$img.removeClass(onClassName);
							$input.prop('checked',false);
						} else {
							$img.addClass(onClassName);
							$input.prop('checked',true);
						}
					});
				}
			});
		},
		chgClass: function(options) {
			var defaults={
					//type : 'onOff',
					offClass : 'tplBtnFavOff',
					onClass : 'tplBtnFavOn'
				},
				options=$.extend(defaults, options);
			return this.each(function() {
				var o=options,
					$this=$(this),
					offClassName=o.offClass,
					onClassName=o.onClass;
				//if (o.type=='onOff'){
					$this.on('click', function(e) {
						if ($this.hasClass(offClassName)) {
							$this.removeClass(offClassName);
							$this.addClass(onClassName);
						} else if ($this.hasClass(onClassName)) {
							$this.removeClass(onClassName);
							$this.addClass(offClassName);
						}
					});
				//}
			});
		},
		openWindow: function(options) {
			var defaults={
					type : 'default', // default or center or center_2 or full
					url : 'http://www.jobkorea.co.kr/',
					name : '잡코리아',
					width : 800,
					height : 700,
					top : 0,
					left : 0
				},
				options=$.extend(defaults, options);
			return this.each(function() {
				var o=options,
					$this=$(this),
					specs;
				if (o.type=="center") {
					o.left=(screen.availWidth-o.width)/2;
					o.top=(screen.availHeight-o.height)/2;
				} else if (o.type=="center_2") {
					o.left=(screen.availWidth-o.width)/2;
					o.top=0;
				} else if (o.type=="full") {
					o.width=screen.availWidth;
					o.height=screen.availHeight;
					o.left=0;
					o.top=0;
				}
				specs='width='+o.width+' ,height='+o.height+', top='+o.top+', left='+o.left;
				$this.on('click', function(e) {
					window.open(o.url, o.name, specs);
					e.stopPropagation();
				});
			});
		},
		pagination: function() {
			return this.each(function() {
				var $this=$(this),
					$ul=$this.children('ul'),
					$a=$ul.find('a');

				$a.on('click', function(e) {
					var $span=$ul.find('span'),
						onTxt=$span.html();
					$span.parent().html('<a href="#">'+$span.html()+'</a>');
					$(this).parent().html('<span class=now>'+$(this).html()+'</span>');
					$a.off('click');
					$this.pagination();
					e.preventDefault();
				});
			});
		},
		placeholder: function(options) {
			var defaults={
					txtClass : 'ph'
				},
				options=$.extend(defaults, options);
			return this.each(function() {
				var o=options,
					$this=$(this),
					$txtClass=$this.find('.'+o.txtClass),
					$type;
				if ($this.find('input[type="text"]').length) {
					$type=$this.find('input[type="text"]');
				} else if ($this.find('textarea').length) {
					$type=$this.find('textarea');
				}
				$type.on('focus', function(e) {
					$txtClass.hide();
				});
				$type.on('blur', function(e) {
					if ($type.val()=='') {
						$txtClass.show();
					}
				});
				$txtClass.on('click', function(e) {
					$type.focus();
				});
			});
		},
		resultView: function(options) {
			var defaults={
					btnClass : 'tplBtn_1',
					resultClass : 'lySchResult',
					closeClass : 'tplLyBtnClose_1'
				},
				options=$.extend(defaults, options);
			return this.each(function() {
				var o=options,
					$this=$(this),
					$result=$this.find('.'+o.resultClass);
				$this.find('.'+o.btnClass).on('click', function(e) {
					$result.show();
				});
				$this.find('.'+o.closeClass).on('click', function(e) {
					$result.hide();
				});
			});	
		},
		select: function(options) {
			return this.each(function() {
				var $select=$(this).find('select');
				$select.children('option:selected').attr('data-selected',1);
				$select.on('change', function(){
					var $this=$(this),
						$label=$this.siblings('label'),
						$selected=$this.children('option:selected');
					$label.text($selected.text());
					if ($selected.attr('data-selected')!=1) {
						$label.addClass('chk');
					} else {
						$label.removeClass('chk');
					}
				});
			});
		},
		selfClose: function() {
			return this.each(function() {
				$(this).on('click', function(){
					self.close();
				});
			});
		},
		tab_1: function(options) {
			var defaults={
					tabMenu : 'tplTabBx',
					tabCont : 'tplTabCnt'
				},
				options=$.extend(defaults, options);
			return this.each(function() {
				var	o=options,
					$this=$(this),
					$tabMenu=$this.find('.'+o.tabMenu),
					$tabButton=$tabMenu.find('button'),
					$tabCont=$this.find('.'+o.tabCont).find('.tabCnt');
				$tabButton.on('click', function(e) {
					var index=$tabButton.index($(this));
					if (!$(this).parent().hasClass('on')) {
						$tabMenu.find('.on').removeClass('on');
						$tabCont.hide();
						$(this).parent().addClass('on');
						$tabCont.eq(index).show();
					}
				});
			});	
		},
		tab_2: function(options) {
			var defaults={
					tabBtn : 'devTplTabBtn',
					tabCont : 'tabCnt'
				},
				options=$.extend(defaults, options);
			return this.each(function() {
				var	o=options,
					$this=$(this),
					$tabButton=$(this).find('.'+o.tabBtn),
					$tabCont=$this.find('.'+o.tabCont);
				$tabButton.on('click', function(e) {
					var index=$tabButton.index($(this));
					if (!$(this).parent().hasClass('on')) {
						$this.find('.on').removeClass('on');
						$tabCont.hide();
						$(this).parent().addClass('on');
						$tabCont.eq(index).show();
					}
				});
			});	
		},
		tableHeight: function(options) {
			return this.each(function() {
				var $this=$(this);
				$this.css('height', $this.parents('td').height());
			});
		},
		tooltipBox: function(options) {
			var defaults={
					type : 'click', // +click_2, hover, hover_2
					lyBtn : 'devTplLyBtn',
					layer : 'devLyType',
					btnClose : 'devLyBtnClose'
				},
				options=$.extend(defaults, options);
			return this.each(function() {
				var o=options,
					$this=$(this),
					$lyBtn=$this.find('.'+o.lyBtn),
					$layer=$this.find('.'+o.layer);
				//console.log($layer);
				switch(o.type) {
					case 'click':
						$lyBtn.on('click', function(e) {
							if ($layer.is(':visible')) {
								$layer.hide();
							} else {
								$layer.show();
							}
						});
						break;
					case 'click_2':
						$lyBtn.on('click', function(e) {
							$layer.show();
						});
						break;
					case 'hover':
						$lyBtn.on('mouseenter', function(e) {
							$layer.show();
						});
						$lyBtn.on('mouseleave', function(e) {
							$layer.hide();
						});
						break;
					case 'hover_2':
						$lyBtn.on('mouseenter', function(e) {
							$layer.show();
						});
						break;
				}
				$layer.find('.'+o.btnClose).on('click', function(e) {
					$layer.hide();
				});
			});
		}
	});
})(jQuery);

/* range fn */
var range = function(start, end, step) {
	var range = [];
	var typeofStart = typeof start;
	var typeofEnd = typeof end;

	if (step === 0) {
		throw TypeError("Step cannot be zero.");
	}

	if (typeofStart == "undefined" || typeofEnd == "undefined") {
		throw TypeError("Must pass start and end arguments.");
	} else if (typeofStart != typeofEnd) {
		throw TypeError("Start and end arguments must be of same type.");
	}

	typeof step == "undefined" && (step = 1);

	if (end < start) {
		step = -step;
	}

	if (typeofStart == "number") {

		while (step > 0 ? end >= start : end <= start) {
			range.push(start);
			start += step;
		}

	} else if (typeofStart == "string") {

		if (start.length != 1 || end.length != 1) {
			throw TypeError("Only strings with one character are supported.");
		}

		start = start.charCodeAt(0);
		end = end.charCodeAt(0);

		while (step > 0 ? end >= start : end <= start) {
			range.push(String.fromCharCode(start));
			start += step;
		}

	} else {
		throw TypeError("Only string and number types are supported");
	}

	return range;

}

/* common fn */
$(function(){
	/* Form */
	$('.devTplChkBx').checkbox();
	$('.devTplSltBx').select();
	$('.devTplSchPh').placeholder();

	/* tab */
	$('.devTplTabBx').tab_1();

	/* table div height */
	$('.tplTbWrap').tableHeight();

	/* layer */
	$('.devTplLyClick').tooltipBox();
	$('.devTplLyHover').tooltipBox({type : 'hover'});
	$('.devTplLyHover_1').tooltipBox({type : 'hover_2'});
	$('.devTplLyClick_1').tooltipBox({type : 'click_2'});
});
