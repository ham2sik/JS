/* 
* 모바일개발팀 UI기술파트 전용(JK 현대화) - 담당자 : 함이식 대리(사용 시 담당자 문의 후 사용)
* File Name : /content/js/jk_uit.js
* Final Editor : 함이식 
* History : [2016.10.12 수정]
*/

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
				// $input.css('opacity',1);
				// $img.css('left', 10);
				if ($input.is(":checked")) { // init
					$img.addClass(onClassName);
				}
				$input.on('change', function(e) {
					var checkedValue=$(this).is(":checked"),
						inputValue=$input.val(),
						inputName=$input.attr('name');
					if (checkedValue) {
						$img.addClass(onClassName);
					} else {
						$img.removeClass(onClassName);
					}
					//$input.prop('checked',checkedValue);
					$this.trigger('jk.change',{'name':inputName, 'checked':checkedValue,'value':inputValue});
					e.stopPropagation();
				});
				if ($img.prop('tagName').toLowerCase()=='span') {
					$img.on('click', function(e) {
						$input.trigger('click');
					});
				}
			});
		},
		radio: function(options) {
			var defaults={
					imgClass : 'tplBtn',
					onClass : 'chk'
				},
				options=$.extend(defaults, options);
			return this.each(function() {
				var o=options,
					$this=$(this),
					$input=$this.find('input[type="radio"]'),
					$img=$this.find('.'+o.imgClass),
					onClassName=o.onClass;
				// $input.css('opacity',1);
				// $img.css('left', 10);
				if ($input.is(":checked")) { // init
					$img.addClass(onClassName);
				}
				$input.on('change', function(e) {
					var checkedValue=$(this).is(":checked"),
						inputValue=$input.val(),
						inputName=$input.attr('name');
					if (checkedValue) {
						$img.addClass(onClassName);
					} else {
						$img.removeClass(onClassName);
					}
					$('input[name='+inputName+']:radio').each(function() {
						if ($(this).is(":checked")) {
							$(this).parent().find('.'+o.imgClass).addClass(onClassName);
						} else {
							$(this).parent().find('.'+o.imgClass).removeClass(onClassName);
						}
					});
					//$input.prop('checked',checkedValue);
					$this.trigger('jk.change',{'name':inputName, 'checked':checkedValue,'value':inputValue});
					e.stopPropagation();
				});
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
		JKplaceholder: function(options) {
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
				//console.log($type.attr('id')+', '+$type.val());
				if ($.trim($type.val())!="") {
					$txtClass.hide();
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
				//$select.children('option:selected').attr('data-selected',1);
				$select.on('change', function(){
					var $this=$(this),
						$label=$this.siblings('label'),
						$selected=$this.children('option:selected');
					$label.text($selected.text());
					//if ($selected.attr('data-selected')!=1) {
						$label.addClass('chk');
					//} else {
					//	$label.removeClass('chk');
					//}
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
					tabContWrap : 'tplTabCnt',
					tabCont : 'tabCnt'
				},
				options=$.extend(defaults, options);
			return this.each(function() {
				var	o=options,
					$this=$(this),
					$tabMenu=$this.find('.'+o.tabMenu),
					$tabBtn=$tabMenu.find('button'),
					$tabCont=$this.find('.'+o.tabContWrap).find('.'+o.tabCont);
				$tabBtn.on('click', function(e) {
					var index=$tabBtn.index($(this)),
						onIndex=$tabMenu.find('li').index($tabMenu.find('li.on'));
						//console.log(onIndex);
					if (!$(this).parent().hasClass('on')) {
						$tabMenu.find('.on').removeClass('on');
						$(this).parent().addClass('on');
						$tabCont.eq(index).show();
						$tabCont.eq(onIndex).hide();
					}
					e.preventDefault();
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
					$tabBtn=$(this).find('.'+o.tabBtn),
					$tabCont=$this.find('.'+o.tabCont);
				$tabBtn.on('click', function(e) {
					var index=$tabBtn.index($(this));
					if (!$(this).parent().hasClass('on')) {
						$this.find('.on').removeClass('on');
						$tabCont.hide();
						$(this).parent().addClass('on');
						$tabCont.eq(index).show();
					}
				});
			});	
		},
		tab_P: function(options) { // 인재검색 탭+레이어 조건
			var defaults={
					tabBtn : 'devTplLyBtn_P',
					tabCloseBtn : 'devLyBtnClose_P',
					tabCont : 'devLyType_P'
				},
				options=$.extend(defaults, options);
			return this.each(function() {
				var	o=options,
					$this=$(this),
					$tabBtn=$this.find('.'+o.tabBtn);
					$tabCloseBtn=$this.find('.'+o.tabCloseBtn);
				$tabBtn.on('click', function(e) {
					var index=$tabBtn.index($(this)),
						$liOn=$this.find('li.on'),
						onIndex=$tabBtn.parents('li').index($liOn);
					//console.log(index+', '+onIndex);
					$(this).parents('li').addClass('on').find('.'+o.tabCont).show();
					$liOn.removeClass('on').find('.'+o.tabCont).hide();
					e.preventDefault();
				});
				$tabCloseBtn.on('click', function(e) {
					var $liOn=$this.find('li.on');
					$liOn.removeClass('on').find('.'+o.tabCont).hide();
					e.preventDefault();
				});
			});	
		},
		tab_layer: function(options) {
			var defaults={
					tabBtn : 'devLyBtnMulti',
					tabCloseBtn : 'devLyBtnMultiClose',
					tabCont : 'devLyMultiType',
					tabWrap : 'devLyMultiWrap'
				},
				options=$.extend(defaults, options);
			return this.each(function() {
				var	o=options,
					$this=$(this),
					$tabBtn=$this.find('.'+o.tabBtn);
					$tabCloseBtn=$this.find('.'+o.tabCloseBtn);
				$tabBtn.on('click', function(e) {
					var index=$tabBtn.index($(this)),
						$liOn=$tabBtn.parents('.on.'+o.tabWrap),
						onIndex=$tabBtn.parents('.'+o.tabWrap).index($liOn);
					//console.log(index+', '+onIndex);
					$(this).parents('.'+o.tabWrap).addClass('on').find('.'+o.tabCont).show();
					$liOn.removeClass('on').find('.'+o.tabCont).hide();
					e.preventDefault();
				});
				$tabCloseBtn.on('click', function(e) {
					var $liOn=$this.find('.on.'+o.tabWrap);
					$liOn.removeClass('on').find('.'+o.tabCont).hide();
					e.preventDefault();
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
				$lyBtn.each(function() { 
					var $thisLyBtn=$(this),
						$thisLayer=$layer;
					if ($thisLyBtn.data('layerclass')!=undefined) {
						$thisLayer=$this.find('.'+$thisLyBtn.data('layerclass'));
					}
					//console.log($thisLayer);
					switch(o.type) {
						case 'click':
							$thisLyBtn.on('click', function(e) {
								if ($thisLayer.is(':visible')) {
									$thisLayer.hide();
								} else {
									$thisLayer.show();
								}
							});
							break;
						case 'click_2':
							$thisLyBtn.on('click', function(e) {
								$thisLayer.show();
							});
							break;
						case 'hover':
							$thisLyBtn.on('mouseenter', function(e) {
								$thisLayer.show();
							});
							$thisLyBtn.on('mouseleave', function(e) {
								$thisLayer.hide();
							});
							break;
						case 'hover_2':
							$thisLyBtn.on('mouseenter', function(e) {
								$thisLayer.show();
							});
							break;
						case 'hover_3':
							$this.on('mouseenter', function(e) {
								$thisLayer.show();
							});
							$this.on('mouseleave', function(e) {
								$thisLayer.hide();
							});
							break;
					}
					$thisLayer.find('.'+o.btnClose).on('click', function(e) {
						$thisLayer.hide();
					});
				});
			});
		}
	});

	/* common fn */
	$(function(){
		/* Form */
		$('.devTplChkBx').checkbox();
		$('.devTplSltBx').select();
		$('.devTplSchPh').JKplaceholder();
		$('.devTplRadio').radio();

		/* tab */
		$('.devTplTabBx').tab_1();

		/* table div height */
		$('.tplTbWrap').tableHeight();

		/* layer */
		$('.devTplLyClick').tooltipBox();
		$('.devTplLyHover').tooltipBox({type : 'hover'});
		$('.devTplLyHover_1').tooltipBox({type : 'hover_2'});
		$('.devTplLyHover_2').tooltipBox({type : 'hover_3'});
		$('.devTplLyClick_1').tooltipBox({type : 'click_2'});
		$('.devTplLyClickA').tooltipBox({lyBtn : 'devTplLyBtnA', layer : 'devLyTypeA', btnClose : 'devLyBtnCloseA'}); // 지하철 노선도 (한영역에 레이어가 2개인 경우)

		/* 인재검색 영역 */
		$('.devTplLyClick_etc').tooltipBox({lyBtn : 'devTplLyBtn_etc', layer : 'devLyType_etc', btnClose : 'devLyBtnClose_etc'});
		$('.devTplLyClick_etc .devTplLyBtn_etc').on('click', function() {
			$('.devTplLyClick_etc.on').removeClass('on').find('.devLyType_etc').hide();
			$(this).parent().addClass('on');
		})

		// $('.devTplChkBx').on('jk.change', function(e, data) {
		// 	console.log(data);
		// });
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

/* make same height fn */
function makeSameHeight(parentPath) {
	var heightArr=[],
		$childrenPath=parentPath.children();
	$childrenPath.each(function(i){
		heightArr[i]=$(this).innerHeight();
	});
	$childrenPath.css('height', Math.max.apply(null, heightArr));
}
