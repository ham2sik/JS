(function($){
	$.fn.extend({
		checkbox: function(options) {// plugin name
			var defaults={//Settings list and the default values
					type : 'default', // +span
					spanClass : 'tplBtn',
					onClass : 'chk'
				},
				options = $.extend(defaults, options);
			return this.each(function() {
				var o=options,
					$this=$(this),
					$input=$this.find('input[type="checkbox"]'),
					$label=$this.find('label'),
					$span=$this.find('.'+o.spanClass),
					onClassName=o.onClass;
				if (o.type!='span') {
					$input.on('click', function(e) {
						$label.toggleClass(onClassName);
					});
				} else {
					$this.on('click', function(e) {
						if ($span.hasClass(onClassName)) {
							$span.removeClass(onClassName);
							$input.prop('checked',false);
						} else {
							$span.addClass(onClassName);
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
				options = $.extend(defaults, options);
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
				options = $.extend(defaults, options);
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
				options = $.extend(defaults, options);
			return this.each(function() {
				var $this=$(this),
					$input=$this.find('input[type="text"]'),
					$txtClass=$this.find('.'+options.txtClass);
				$input.on('focus', function(e) {
					$txtClass.hide();
				});
				$input.on('blur', function(e) {
					if ($input.val()=='') {
						$txtClass.show();
					}
				});
				$txtClass.on('click', function(e) {
					$input.focus();
				});
			});
		},
		resultView: function(options) {
			var defaults={
					btnClass : 'tplBtn_1',
					resultClass : 'lySchResult',
					closeClass : 'tplLyBtnClose_1'
				},
				options = $.extend(defaults, options);
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
				var $this=$(this),
					$select=$this.find('select');
				$select.on('change', function(){
					$select.siblings('label').text($select.children('option:selected').text());
				});
			});
		},
		tab_1: function(options) {
			var defaults={
					tabMenu : 'tplTabBx',
					tabCont : 'tplTabCnt'
				},
				options = $.extend(defaults, options);
			return this.each(function() {
				var	o=options,
					$this=$(this),
					$tabButton=$this.find('.'+o.tabMenu).find('button'),
					$tabCont=$this.find('.'+o.tabCont).find('.tabCnt');
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
		tab_2: function(options) {
			var defaults={
					tabBtn : 'devTplTabBtn',
					tabCont : 'tabCnt'
				},
				options = $.extend(defaults, options);
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
		tooltipBox: function(options) {
			var defaults={
					type : 'click', // +hover
					lyBtn : 'devTplLyBtn',
					layer : 'tplLyType',
					btnClose : 'tplLyBtnClose'
				},
				options = $.extend(defaults, options);
			return this.each(function() {
				var o=options,
					$this=$(this),
					$lyBtn=$this.find('.'+o.lyBtn),
					$layer=$this.find('.'+o.layer);
				//console.log($layer);

				if (o.type=='click') {
					$lyBtn.on('click', function(e) {
						if ($layer.is(':visible')) {
							$layer.hide();
						} else {
							$layer.show();
						}
					});
				} else if (o.type=='hover') {
					$lyBtn.on('mouseenter', function(e) {
						$layer.show();
					});
					$lyBtn.on('mouseleave', function(e) {
						$layer.hide();
					});
				}
				$layer.find('.'+o.btnClose).on('click', function(e) {
					$layer.hide();
				});
			});
		}
	});
})(jQuery);
