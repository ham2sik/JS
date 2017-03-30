function loadScript(url, callback) {
	var scriptEle=document.createElement('script');
	scriptEle.type='text/javascript';
	var loaded=false;
	scriptEle.onreadystatechange=function() {
		//console.log('onreadystatechange, '+this.readyState);
		if (this.readyState == 'loaded' || this.readyState == 'complete') { // 서버에서 읽어올 경우 loaded, 캐쉬에서 가져올 경우 complete 이기에 둘 모두 처리
			if (loaded) return;
			loaded = true;
			callback();
		}
	}
	scriptEle.onload=function() {
		callback();
	};
	scriptEle.src=url;
	document.getElementsByTagName('head')[0].appendChild(scriptEle);
}







(function($) {
	/* swipe data fn */
	var swipeData=function(urlName, urlNum, $path) {
		$.ajax({
			type: "GET",
			url: "/html/main/list/Main_"+urlName+"_List_Ajax.asp", // template (기존 "/include/Main/Main_"+urlName+"_List_Ajax.asp")
			data: {Page_No: urlNum},
			success: function(data, textStatus, jqXHR) {
				$path.innerHTML=data;
				$path.setAttribute('data-check', 1);
				//console.log(urlName+': [page number '+urlNum+'] load '+textStatus);
			}
		});
	}
	/* main swipe fn */
	var initMainSwipe = function($ele) {
		$ele.each(function() {
			var $this = $(this);
			var $mainSwipeWrap = $this.closest("article");
			if ($this.attr("PaginationType") == "fraction") { // PRIME , GRAND , GOLD , 1000대 기업 , 주요 채용정보
				//console.log('Pagi:'+$mainSwipeWrap.attr('id'));
				var swiper = new Swiper($this, {
					loop: true,
					pagination: $mainSwipeWrap.find(".countNum"),
					preloadImages: false,
					lazyLoading: false,
					paginationType: "fraction",
					paginationFractionRender: function (swiper, currentClassName, totalClassName) {
						return '<span class="' + currentClassName + '"></span>'+'/'+'<span class="' + totalClassName + '"></span>';
					},
					onSlideChangeStart : function(swiper) {
						var wrapId=$mainSwipeWrap.attr('id'), // wrap id(MGOLD, MSILVER, Group30, Best1000)
							swiperPrevIndex=swiper.previousIndex, // previous index number(init value=0)
							swiperActiveIndex=swiper.activeIndex, // active index number(init value=1)
							$slideActive=swiper.slides[swiperActiveIndex], // active slide path
							$slideActiveNext=$slideActive.nextElementSibling, // next slide path
							$slideActivePrev=$slideActive.previousElementSibling, // prev slide path
							slideLength=swiper.slides.length-2, // silde list size
							urlNum; // load page number
						//console.log(swiper);
						if (slideLength < 4) { // 주요 채용공고(slideLength=2) 제외
							return false;
						}
						if ($slideActiveNext==null) { // case max number
							//console.log('null');
							return false;
						}
						if ((swiperPrevIndex < swiperActiveIndex)&&($slideActiveNext.getAttribute('data-check')==null)) { // swipe next
							urlNum=swiperActiveIndex;
							swipeData(wrapId, urlNum, $slideActiveNext);
						}
						if ($slideActivePrev==null) { // case 0
							if (swiper.slides[slideLength-1].getAttribute('data-check')==null) {
								urlNum=slideLength-2;
								$slideActivePrev=swiper.slides[slideLength-1];
								swipeData(wrapId, urlNum, $slideActivePrev);
							}
							return false;
						}
						if ((swiperPrevIndex > swiperActiveIndex)&&($slideActivePrev.getAttribute('data-check')==null)) { // swipe prev
							urlNum=swiperActiveIndex-2;
							swipeData(wrapId, urlNum, $slideActivePrev);
						}
						if ($slideActive.getAttribute('data-check')==null) { // provision
							//console.log('%c provision mode!!!', 'color: red');
							urlNum=swiperActiveIndex-1;
							swipeData(wrapId, urlNum, $slideActive);
						}
					}
				});
			}
		});
	}

	/* 최근 본 메뉴 click fn */
	$('.userViewBtn button').on('click', function() {
		var $this=$(this);
		if ( !$this.hasClass('open') ) {
			$("body").on('touchmove', function(e){e.preventDefault()});
			$('#jkHeader, .mainSchBtn').css("z-index",'5');
			$this.addClass('open');
			$this.find('span.tx').text('메뉴전체보기닫기');
			$(".userViewAllWrap").show();
			$(".mobileNavCover").show();
		} else {
			$("body").off('touchmove');
			$('#jkHeader, .mainSchBtn').css("z-index",'');
			$this.removeClass('open');
			$this.find('span.tx').text('메뉴전체보기');
			$(".userViewAllWrap").hide();
			$(".mobileNavCover").hide();
		}
	});
	$('.mobileNavCover').on('click', function() {
		$('.userViewBtn button').trigger('click');
	});

	/*vvip click fn */
	$('#mVvip .countNum02').on('click', function() {
		$("#mVvip .viewLayer").show();
		//$("#mVvip .vvipLayerCover").show();
		//window.addEventListener("touchmove", function(e) { e.preventDefault(); }, {capture: false, passive: false});
		$('body').css({overflow: 'hidden'}); 
	});
	$('#mVvip .btnLayerClose button, #mVvip .btnLayerClose02 button').on('click', function() {
		$("#mVvip .viewLayer").hide();
		//$("#mVvip .vvipLayerCover").hide();
		$('body').css({overflow: ''});
		$('body').animate({scrollTop:0}, { queue:false, duration:300 });
	});

	/* footer click fn */
	$(".footInfo dt").on("click", function(){
		if($(this).hasClass("on")){
			$(".footInfo dd").hide();
			$(this).removeClass("on");
		}else{
			$(".footInfo dd").show();
			$(this).addClass("on");
		}
	});
	$(".csTime").on("click",function(){
		if($(this).hasClass("on")){
			$(this).removeClass("on").next().hide();
		}else{
			$(this).addClass("on").next().show();
		}
	});

	$(window).load(function() {
		loadScript('/include/js/swiper.min_3.3.1.js', function () {
			initMainSwipe($('.swiper-container'));
			/* 최근 본 메뉴 swipe */
			var swiperFreeMode = new Swiper('.swiper-container.freeMode', {
				slidesPerView: 'auto',
				freeMode: true
			});

			/* vvip, 30대그룹 init */
			var i,
				listSize=$('.list2wayVvip .listLogo').size();

			window.onresize = function (event) {
				applyOrientation();
			}
			applyOrientation();

			function applyOrientation() {
				if ((window.innerWidth<420)&&(window.innerWidth<window.innerHeight)) {
					console.log('lazy load mode(mobile portrait)');
					for (i=4;i<7;i++) {
						var $nextListImg=$('.list2wayVvip .listLogo').eq(i),
							$prevListImg=$('.list2wayVvip .listLogo').eq(listSize-i),
							$nextViewImg=$('.view2wayVvip .logo').eq(i).find('img'),
							$prevViewImg=$('.view2wayVvip .logo').eq(listSize-i).find('img');

						$nextListImg.attr("src", $nextListImg.data("original")).parents('.swiper-slide').attr('data-check','1');
						$prevListImg.attr("src", $prevListImg.data("original")).parents('.swiper-slide').attr('data-check','1');

						$nextViewImg.attr("src", $nextViewImg.data("original")).parents('.swiper-slide').attr('data-check','1');
						$prevViewImg.attr("src", $prevViewImg.data("original")).parents('.swiper-slide').attr('data-check','1');
					}
				} else {
					console.log('all load mode(mobile landscape mode, tablet, pc)');
					$(".list2wayVvip .swiper-slide").each(function() {
						if ($(this).attr('data-check')!=1) {
							$(this).attr('data-check','1').find('.lazy_2way').attr("src", $(this).find('.lazy_2way').data("original"));
						}
					});
					$(".view2wayVvip .swiper-slide").each(function() {
						if ($(this).attr('data-check')!=1) {
							$(this).attr('data-check','1').find('.lazy_2way').attr("src", $(this).find('.lazy_2way').data("original"));
						}
					});
					$(".list2way .swiper-slide").each(function() {
						if ($(this).attr('data-check')!=1) {
							$(this).attr('data-check','1').find('.lazy_2way').attr("src", $(this).find('.lazy_2way').data("original"));
						}
					});
				}
			}

			var swiperList2wayVvip = new Swiper('.swiper-container.list2wayVvip', {
				spaceBetween: 12,
				loop: true,
				centeredSlides: true,
				slidesPerView: 'auto',
				touchRatio: 0.2,
				slideToClickedSlide: true,
				onSlideChangeStart : function(swiper) {
					var swiperPrevIndex=swiper.previousIndex, // previous index number(init value=0)
						swiperActiveIndex=swiper.activeIndex, // active index number(init value=slideLength)
						slideLength=swiper.loopedSlides, // silde list size
						$lazy_2wayWrap,
						$lazy_2way;
					//console.log(swiper);

					if (swiperPrevIndex < swiperActiveIndex) { // swipe next
						for (i=0;i<7;i++) {
							$lazy_2wayWrap=swiper.slides[swiperActiveIndex+i];
							if ($lazy_2wayWrap.getAttribute('data-check')!=1) {
								//console.log('swiperActiveIndex:'+swiperActiveIndex+' , i:'+i);
								$lazy_2way=$lazy_2wayWrap.getElementsByClassName('lazy_2way')[0];
								$lazy_2way.src=$lazy_2way.getAttribute('data-original');
								$lazy_2wayWrap.setAttribute('data-check', 1);
							}
						}
					} else if (swiperPrevIndex > swiperActiveIndex) { // swipe prev
						for (i=0;i<7;i++) {
							$lazy_2wayWrap=swiper.slides[swiperActiveIndex-i];
							if ($lazy_2wayWrap.getAttribute('data-check')!=1) {
								//console.log('swiperActiveIndex:'+swiperActiveIndex+' , i:'+i+' , slideLength:'+slideLength);
								$lazy_2way=$lazy_2wayWrap.getElementsByClassName('lazy_2way')[0];
								$lazy_2way.src=$lazy_2way.getAttribute('data-original');
								$lazy_2wayWrap.setAttribute('data-check', 1);
							}
						}
					}
				}
			});
			var swiperView2wayVvip = new Swiper('.swiper-container.view2wayVvip', {
				loop: true,
				pagination: $('.swiper-container.view2wayVvip').siblings(".countNum02"),
				slidesPerView: 'auto',
				preloadImages: false,
				lazyLoading: false,
				slideToClickedSlide: true,
				paginationType: "fraction",
				paginationFractionRender: function (swiper, currentClassName, totalClassName) {
					return '<span class="' + currentClassName + '"></span>'+'/'+'<span class="' + totalClassName + '"></span>';
				},
				onSlideChangeStart : function(swiper) {
					var swiperPrevIndex=swiper.previousIndex, // previous index number(init value=0)
						swiperActiveIndex=swiper.activeIndex, // active index number(init value=slideLength)
						slideLength=swiper.loopedSlides, // silde list size
						$lazy_2wayWrap,
						$lazy_2way;
					//console.log(swiper);

					if (swiperPrevIndex < swiperActiveIndex) { // swipe next
						for (i=1;i<7;i++) {
							$lazy_2wayWrap=swiper.slides[swiperActiveIndex+i];
							if ($lazy_2wayWrap.getAttribute('data-check')==null) {
								//console.log('swiperActiveIndex:'+swiperActiveIndex+' , i:'+i);
								$lazy_2way=$lazy_2wayWrap.getElementsByClassName('lazy_2way')[0];
								$lazy_2way.src=$lazy_2way.getAttribute('data-original');
								$lazy_2wayWrap.setAttribute('data-check', 1);
							}
						}
					} else if (swiperPrevIndex > swiperActiveIndex) { // swipe prev
						for (i=1;i<7;i++) {
							$lazy_2wayWrap=swiper.slides[swiperActiveIndex-i];
							if ($lazy_2wayWrap.getAttribute('data-check')==null) {
								//console.log('swiperActiveIndex:'+swiperActiveIndex+' , i:'+i+' , slideLength:'+slideLength);
								$lazy_2way=$lazy_2wayWrap.getElementsByClassName('lazy_2way')[0];
								$lazy_2way.src=$lazy_2way.getAttribute('data-original');
								$lazy_2wayWrap.setAttribute('data-check', 1);
							}
						}
					}
				}
			});
			swiperList2wayVvip.params.control = swiperView2wayVvip;
			swiperView2wayVvip.params.control = swiperList2wayVvip;

			/* 30대 그룹사 */
			var swiperList2way = new Swiper('.swiper-container.list2way', {
				spaceBetween: 11,
				loop: true,
				centeredSlides: true,
				slidesPerView: 'auto',
				touchRatio: 0.2,
				slideToClickedSlide: true,
				onSlideChangeStart : function(swiper) {
					var swiperPrevIndex=swiper.previousIndex, // previous index number(init value=0)
						swiperActiveIndex=swiper.activeIndex, // active index number(init value=slideLength)
						slideLength=swiper.loopedSlides, // silde list size
						$lazy_2wayWrap,
						$lazy_2way;
					//console.log(swiper);

					if (swiperPrevIndex < swiperActiveIndex) { // swipe next
						for (i=0;i<5;i++) {
							$lazy_2wayWrap=swiper.slides[swiperActiveIndex+i];
							if ($lazy_2wayWrap.getAttribute('data-check')!=1) {
								console.log('star30-swiperActiveIndex:'+swiperActiveIndex+' , i:'+i);
								$lazy_2way=$lazy_2wayWrap.getElementsByClassName('lazy_2way')[0];
								$lazy_2way.src=$lazy_2way.getAttribute('data-original');
								$lazy_2wayWrap.setAttribute('data-check', 1);
							}
						}
					} else if (swiperPrevIndex > swiperActiveIndex) { // swipe prev
						for (i=0;i<5;i++) {
							$lazy_2wayWrap=swiper.slides[swiperActiveIndex-i];
							if ($lazy_2wayWrap.getAttribute('data-check')!=1) {
								console.log('star30-swiperActiveIndex:'+swiperActiveIndex+' , i:'+i+' , slideLength:'+slideLength);
								$lazy_2way=$lazy_2wayWrap.getElementsByClassName('lazy_2way')[0];
								$lazy_2way.src=$lazy_2way.getAttribute('data-original');
								$lazy_2wayWrap.setAttribute('data-check', 1);
							}
						}
					}
				}
			});
			var swiperView2way = new Swiper('.swiper-container.view2way', {
				loop: true,
				pagination: $('.swiper-container.view2way').siblings(".countNum"),
				slidesPerView: 'auto',
				preloadImages: false,
				lazyLoading: false,
				slideToClickedSlide:true,
				paginationType: "fraction",
				paginationFractionRender: function (swiper, currentClassName, totalClassName) {
					return '<span class="' + currentClassName + '"></span>'+'/'+'<span class="' + totalClassName + '"></span>';
				}
			});
			swiperList2way.params.control = swiperView2way;
			swiperView2way.params.control = swiperList2way;

			/* 이벤트 - footer update */
			var swiperFreeMode = new Swiper('#event .swiper-container', {
				slidesPerView: 'auto',
				freeMode: true
			});
		});
		$("img.lazy").each(function() {
			$(this).attr("src", $(this).data("original"));
		});
		$(".lazyBg").each(function() {
			$(this).removeClass('lazyBg');
		});
	});
})(jQuery);
