/* html */
$(window).load(function(){
	jobCal({toDay : '20170204'}); // today값 개발 필요
});
/* //html */

var jobCal = function(options) {
	var defaults={
			toDay : '20170101', // today
			loadHeight : 300 // 스크롤 시 데이터 호출 값(하단으로부터 200px)
		},
		options=$.extend(defaults, options),
		o=options,
		limitDay=moment(o.toDay, "YYYYMMDD").add(5, 'months').format("YYYYMM"), // 4개월 후 월말까지
		activeDate=o.toDay,
		activeYear=o.toDay.substr(0,4), // active year
		activeMonth=o.toDay.substr(4,2), // active month

		orcTopHeight=$('.orcTop').innerHeight(), // month area height
		calDateHeight=$('.calDateList').innerHeight(), // day swipe area height
		activeNum=$('.calDateList li').index($('#link'+o.toDay)), // day swipe active index number
		onPathId,
		isLoadSwipeData=false,
		calDateList,

		contCount, // 리스트 갯수
		loadingTop, // list load ajax offset value
		orcOffset=[], // list cont offset

		$loading=$('.loading'),
		isDoingClickFn=0,
		isDoingAjaxList=0,
		isDoingAjaxDate=0,
		isOverHeight=0,
		overHeightDate;

	console.log('today:'+o.toDay+', limitDay:'+limitDay);

	var isMobile = {
		Android: function () {
			 return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function () {
			 return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function () {
			 return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function () {
			 return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function () {
			 return navigator.userAgent.match(/IEMobile/i);
		},
		any: function () {
			 return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};


	var init=function() {
		$('.notiTxt, .bbsBann, .starTotalNav, #ban, .actPrevTop, footer').hide(); // footer hide
		// url check, on class add
		if (queryString.Sel_Date===undefined) {
			onPathId='link'+o.toDay;
		} else {
			/* 조건 추가 limitDay */
			if (Number(queryString.Sel_Date.substr(0,6))==Number(limitDay)-1) {
				//console.log(Number(queryString.Sel_Date.substr(0,6))); // limit201708 , this 201707
				onPathId='link'+queryString.Sel_Date;
				activeDate=queryString.Sel_Date;
				activeYear=queryString.Sel_Date.substr(0,4);
				activeMonth=queryString.Sel_Date.substr(4,2);

				$('.calDateList ul').find('li').each(function(){
					if ($(this).attr('id').substr(4,6)==limitDay) {
						$(this).remove();
					}
				});
				$('.calDateList').addClass('on'); 
				$('.calDateList ul').css('width',$('.calDateList ul li').size()*51);
				$('.orcContByDate .orcCont').each(function(){
					if (Number($(this).attr('id').substr(4,6))>=Number(limitDay)) {
						$(this).remove();
						$loading.addClass('done');
						$('.notiTxt, .bbsBann, .starTotalNav, #ban, .actPrevTop, footer').show();
					}
				});
			} else if (Number(queryString.Sel_Date.substr(0,6))>=Number(limitDay)) {
				alert('주소 입력이 잘못되었습니다.');
				urlChange(location.href, o.toDay);
			} else {
				onPathId='link'+queryString.Sel_Date;
				activeDate=queryString.Sel_Date;
				activeYear=queryString.Sel_Date.substr(0,4);
				activeMonth=queryString.Sel_Date.substr(4,2);
			}
		}

		checkPoint();
		setTimeout(function () {
			window.scrollTo(0,0);
			bindFn();
		}, 10);

		//month
		$('#date').html(activeYear+'년 '+ cutZero(activeMonth)+'월');
		// swipe 영역 월 활성화
		$('#link'+moment(activeDate, "YYYYMMDD").format("YYYYMM")+'01').find('span').eq(0).html(cutZero(moment(activeDate, "YYYYMMDD").format("MM"))+'월'); // this month
		$('#link'+moment(activeDate, "YYYYMMDD").add(1, 'months').format("YYYYMM")+'01').find('span').eq(0).html(cutZero(moment(activeDate, "YYYYMMDD").add(1, 'months').format("MM"))+'월'); // next month
		$('#link'+moment(activeDate, "YYYYMMDD").subtract(1, 'months').format("YYYYMM")+'01').find('span').eq(0).html(cutZero(moment(activeDate, "YYYYMMDD").subtract(1, 'months').format("MM"))+'월'); // prev month
		$('#link'+o.toDay).addClass('today').find('span').eq(0).html('오늘');
		//day swipe
		swiperOption.initialSlide=$('.calDateList li').index($('#'+onPathId));
		calDateList=new Swiper('.calDateList', swiperOption);
	}

	var swiperOption={ // cal day swiper option
		initialSlide: 0,
		centeredSlides: true,
		slideToClickedSlide: false,
		spaceBetween: 0,
		slidesPerView: "auto",
		onSlideChangeStart : function(swiper) {
			var activeId=$('.calDateList li').eq(swiper.activeIndex).attr('id');
			daySwipeCallback(activeId);
		}
	};

	var queryString = function () {
		var query_string = {},
			query = window.location.search.substring(1);
			vars = query.split("&");
		for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");
			if (typeof query_string[pair[0]] === "undefined") {
				query_string[pair[0]] = decodeURIComponent(pair[1]);
			} else if (typeof query_string[pair[0]] === "string") {
				var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
				query_string[pair[0]] = arr;
			} else {
				query_string[pair[0]].push(decodeURIComponent(pair[1]));
			}
		}
		return query_string;
	}();

	var cutZero=function(data) {
		if (data.substr(0,1)==="0") {
			data=data.substr(1,1);
		}
		return data;
	}

	var arrayCheck=function(num) {
		var maxnum;
		orcOffset.forEach( function(v, i){
			if(v <= num ){
				maxnum=i;
			}
		});
		return maxnum;
	}

	var checkPoint=function() { // scroll check fn
		contCount=$('.orcContByDate .orcCont').size();
		loadingTop=$(document).height()-$(window).height()-o.loadHeight;
		orcOffset=[];
		$('#orcArea .orcCont').each(function(i){
			orcOffset[i]=$(this).offset().top-(orcTopHeight+calDateHeight+2);
		});
		//console.log(orcOffset);
	}

	var urlChange=function(locationHref, changeDate) {
		var urlArr=locationHref.split("?"),
			renewURL=urlArr[0]+'?',
			vars = [],
			hashes,
			hash,
			hasParaDate=0;

		if (typeof urlArr[1] !== "undefined") {
			hashes=urlArr[1].split('&');
			for(var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				if (hash[0]!='Sel_Date') {
					renewURL+=hash[0]+'='+hash[1]+'&';
				} else {
					renewURL+=hash[0]+'='+changeDate+'&';
					hasParaDate=1;
				}
			}
			if (hasParaDate==0) {
				renewURL+='Sel_Date='+changeDate+'&';
				hasParaDate=1;
			}
			renewURL=renewURL.slice(0,-1);
		} else {
			renewURL+='Sel_Date='+changeDate;
		}
		// history.pushState(null, null, renewURL);
		//history.replaceState(null, null, renewURL);
		location.replace(renewURL);
	}

	var bindFn=function() {
		var orcTopTop=$('.orcTop').offset().top, // month area offset
			calDateTop=$('.calDateList').offset().top, // day swipe area offset
			$orcTop=$('.orcTop'),
			$calDateList=$('.calDateList'),
			$content=$('.content');

		/* scroll fn */
		function handleTopMenu() {
			var scTop=window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
			var orcTopW = $(window).width();

			/* top menu scroll fixed */
			/*
			if (scTop<orcTopTop) {
				//$orcTop.removeClass('fixed');
				$orcTop.css({ "position": "", "top": "", "z-index": "", "width": "" });
				//$calDateList.removeClass('fixed');
				$calDateList.css({ "position": "", "top": "", "z-index": ""});
				$content.css('padding-top', '');
			} else if (scTop<calDateTop-orcTopHeight) {
				//$orcTop.addClass('fixed');
				$orcTop.css({ "position": "fixed", "top": 0, "z-index": 100, "width": orcTopW });
				//$calDateList.removeClass('fixed');
				$calDateList.css({ "position": "", "top": "", "z-index": ""});
				$content.css('padding-top', orcTopHeight+1);
			} else {
				//$orcTop.addClass('fixed');
				$orcTop.css({ "position": "fixed", "top": 0, "z-index": 100, "width": orcTopW });
				//$calDateList.addClass('fixed');
				$calDateList.css({ "position": "fixed", "top": "44px", "z-index": 100});
				$content.css('padding-top', orcTopHeight+calDateHeight+2);
			}
			*/
			// test
			if (scTop<orcTopTop) {
				$('#devTopWrap').removeClass('fixed').css({ "position": "", "top": "", "z-index": "", "width": "" });
				$content.css('padding-top', '');
			} else {
				$('#devTopWrap').addClass('fixed').css({ "position": "fixed", "top": 0, "z-index": 100, "width": orcTopW });
				$content.css('padding-top', orcTopHeight+calDateHeight+2);
			}
		}
		function handleMove() {
			var scTop=window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

			/* month, day swipe */
			var scTopId=$('.orcContByDate .orcCont').eq(arrayCheck(scTop)).attr('id'),
				calId;
			//console.log(arrayCheck(scTop)+', '+scTopId);
			if (scTopId!==undefined) {
				calId=scTopId.replace('list','link');
				var activeDateIdIndex=$('.calDateList li').index($('#'+calId));
				//console.log(activeDateIdIndex);// 조건문 추가 

				// if ((activeYear!==scTopId.substr(4,4))||(activeMonth!==scTopId.substr(8,2))) {
				// 	daySwipeCallback(calId);
				// }
				onPathId=$('.calDateList li').eq(activeDateIdIndex).attr('id');
				//urlChange(location.href, scTopId.replace('list',''));
				$('#dev_calendarCurrentDate').val(scTopId.replace('list',''));
				calDateList.slideTo(activeDateIdIndex);
			} else { /* goTop */
				scTopId=$('.orcContByDate .orcCont').eq(0).attr('id');
				calId=scTopId.replace('list','link');
				var colDate=scTopId.replace('list',''),
					thisMonth=moment(colDate, "YYYYMM").format("YYYYMM"),
					activeDate=activeYear+activeMonth,
					nextDate=moment(activeDate, "YYYYMM").add(1, 'months').format("YYYYMM"),
					prevDate=moment(activeDate, "YYYYMM").subtract(1, 'months').format("YYYYMM");

				// if (!((thisMonth==activeDate)||(thisMonth==nextDate)||(thisMonth==prevDate))) {
				// 	daySwipeCallback(calId);
				// }
				onPathId=calId;
				//urlChange(location.href, colDate);
				$('#dev_calendarCurrentDate').val(colDate);
				calDateList.slideTo($('.calDateList li').index($("#"+calId)));
				/* 특수상황 */
				if (arrayCheck(scTop)!==undefined) {
					location.reload();
				}
			}

			/* list */
			if ($loading.hasClass('done')) {
				return false;
			}

			// if (activeYear!==scTopId.substr(4,4)) {
			// 	loadList(scTopId.replace('list',''), 'click');
			// 	return false;
			// }
			//console.log('loadingTop:'+loadingTop+', scTop:'+scTop);
			if ((scTop>=loadingTop)&&(!$loading.hasClass('doing'))) {
				$loading.addClass('doing');
				loadList(moment($('.orcContByDate .orcCont').eq(contCount-1).attr('id').replace('list',''), "YYYYMMDD").add(1, 'days').format("YYYYMMDD"), 'scroll');
			}
		}
		if (isMobile.iOS()) {
			console.log('iOS');

			var moveTimer, topMenuTimer;
			window.addEventListener('touchmove', function() {
				clearTimeout(moveTimer);
				moveTimer=setTimeout(function(){handleMove()},400);
			});
			window.addEventListener('scroll', function() {
				handleTopMenu();
			});
		} else {
			console.log('Android');
			window.addEventListener('scroll', function() {
				handleTopMenu();
				handleMove();
			});
		}

		/* day swipe click fn */
		$('.calDateList').on('click', 'a', function(e) {
			var clickedDate=$(this).parent().attr('id').replace('link',''),
				$listId=$('#list'+clickedDate),
				$listLi=$(this).parent(),
				thisMonth=moment(clickedDate, "YYYYMM").format("YYYYMM"),
				activeDate=activeYear+activeMonth,
				nextDate=moment(activeDate, "YYYYMM").add(1, 'months').format("YYYYMM"),
				prevDate=moment(activeDate, "YYYYMM").subtract(1, 'months').format("YYYYMM");

			if ((isDoingClickFn==1)||(isDoingAjaxList==1)||(isDoingAjaxDate==1)) {
				return false;
			}
			isDoingClickFn==1;

			/* day swipe */
			onPathId='link'+clickedDate;
			if (!((thisMonth==activeDate)||(thisMonth==nextDate)||(thisMonth==prevDate))) {
				daySwipeCallback('link'+clickedDate);
			}
			//calDateList.slideTo($('.calDateList li').index($listLi));

			/* list */
			if ($listId.length) {
				if (loadingTop < $listId.offset().top-orcTopHeight-calDateHeight-1) {
					isOverHeight=1;
					overHeightDate=clickedDate;
				}
				setTimeout(function () {
					window.scrollTo(0,$listId.offset().top-orcTopHeight-calDateHeight-1);
					if (isMobile.iOS()) {
						handleMove();
					} 
				}, 10);
			} else {
				calDateList.slideTo($('.calDateList li').index($listLi));
				loadList(clickedDate, 'click');
				//urlChange(location.href, clickedDate);
			}

			/* url */
			//urlChange(location.href, clickedDate);
			$('#dev_calendarCurrentDate').val(clickedDate);

			isDoingClickFn==0;
			e.preventDefault();
		});

		/* month prev click fn */
		$('.sltYear .button.left').on('click', function(e) {
			var clickedDate=moment(activeYear+activeMonth, "YYYYMM").subtract(1, 'months').format("YYYYMM")+'01'
				dateId='link'+clickedDate;

			if ((isDoingClickFn==1)||(isDoingAjaxList==1)||(isDoingAjaxDate==1)) {
				return false;
			}
			isDoingClickFn==1;

			onPathId=dateId;
			daySwipeCallback(dateId);
			calDateList.slideTo($('.calDateList li').index($("#"+dateId)));
			loadList(clickedDate, 'click');
			//urlChange(location.href, clickedDate);
			$('#dev_calendarCurrentDate').val(clickedDate);

			isDoingClickFn==0;
			e.preventDefault();
		});
		/* month next click fn */
		$('.sltYear .button.right').on('click', function(e) {
			var date=moment(activeYear+activeMonth, "YYYYMM").add(1, 'months').format("YYYYMM"),
				dateId='link'+date+'01';

			if ((isDoingClickFn==1)||(isDoingAjaxList==1)||(isDoingAjaxDate==1)) {
				return false;
			}
			isDoingClickFn==1;

			if (Number(date)<Number(limitDay)) {
				onPathId=dateId;
				daySwipeCallback(dateId);
				calDateList.slideTo($('.calDateList li').index($("#"+dateId)));
				loadList(date+'01', 'click');
				//urlChange(location.href, date+'01');
				$('#dev_calendarCurrentDate').val(date+'01');
			} else {
				alert("오늘 이후 4개월까지 확인 가능합니다.");
			}

			isDoingClickFn==0;
			e.preventDefault();
		});

		$('.top')[0].onclick=null;
		$('.goToday, .top').on('click', function() {
			var linkId='link'+o.toDay,
				$linkId=$('#'+linkId),
				thisMonth=moment(o.toDay, "YYYYMM").format("YYYYMM"),
				activeDate=activeYear+activeMonth,
				nextDate=moment(activeDate, "YYYYMM").add(1, 'months').format("YYYYMM");
				prevDate=moment(activeDate, "YYYYMM").subtract(1, 'months').format("YYYYMM");

			if ((isDoingClickFn==1)||(isDoingAjaxList==1)||(isDoingAjaxDate==1)) {
				return false;
			}
			isDoingClickFn==1;
			onPathId=linkId;
			loadList(o.toDay, 'today');
			if (!((thisMonth==activeDate)||(thisMonth==nextDate)||(thisMonth==prevDate))) {
				daySwipeCallback(linkId);
			}
			calDateList.slideTo($('.calDateList li').index($linkId));

			//urlChange(location.href, o.toDay);
			$('#dev_calendarCurrentDate').val(o.toDay);

			isDoingClickFn==0;
		});
	}

	var loadList=function(date, motion) {
		var $path=$('.orcContByDate');

		isDoingAjaxList=1;
		$.ajax({
			type: "GET",
			url: "/start/calendar/data/weekList", // /trunk/Mobile/Jobkorea/NET_Root/starter/cal/data/list.html
			data: {Sel_Date: date},
			success: function(data, textStatus, jqXHR) {
				//alert(1);
				if ($loading.hasClass('done')) {
					$loading.removeClass('done');
					$('.notiTxt, .bbsBann, .starTotalNav, #ban, .actPrevTop, footer').hide();
				}
				if ((Number(date.substr(6,2))>22)||(Number(date.substr(0,6))>=Number(limitDay))) {
					if (!$('.dataCheckArea').length) {
						$('body').append('<div class="dataCheckArea"></div>');
					}
					$('.dataCheckArea').html(data);
					$('.dataCheckArea .orcCont').each(function(i){
						if (Number($(this).attr('id').substr(4,6))>=Number(limitDay)) {
							//console.log('thisDay:'+Number($(this).attr('id').substr(4,6))+', limitDay:'+Number(limitDay));
							$(this).remove();
							//console.log('done');
							$loading.addClass('done');
							$('.notiTxt, .bbsBann, .starTotalNav, #ban, .actPrevTop, footer').show();
						}
					});
					data=$('.dataCheckArea').html();
					$('.dataCheckArea').empty();
				}

				// if (contCount>14) { list data 삭제 조건
				// }

				if (motion=='scroll') {
					$path.append(data);
					checkPoint();
					$loading.removeClass('doing');
					if (isOverHeight==1) {
						setTimeout(function () {
							window.scrollTo(0,$('#list'+overHeightDate).offset().top-orcTopHeight-calDateHeight-1);
							isOverHeight=0;
							$('.calDateList li.on').removeClass('on');
							$('#'+onPathId).addClass('on');
							isDoingAjaxList=0;
						}, 10);
					} else {
						$('.calDateList li.on').removeClass('on');
						$('#'+onPathId).addClass('on');
						isDoingAjaxList=0;
					}
				} else if (motion=='click') {
					if ($('#devTopWrap').hasClass('fixed')) {
						setTimeout(function () {
							$path.html(data);
							checkPoint();
							$loading.removeClass('doing');
							window.scrollTo(0,$('#list'+date).offset().top-orcTopHeight-calDateHeight-1);
							$('.calDateList li.on').removeClass('on');
							$('#'+onPathId).addClass('on');
							isDoingAjaxList=0;
						}, 10);
					} else {
						$path.html(data);
						checkPoint();
						$loading.removeClass('doing');
						$('.calDateList li.on').removeClass('on');
						$('#'+onPathId).addClass('on');
						isDoingAjaxList=0;
					}
				} else if (motion=='today') {
					setTimeout(function () {
						$path.html(data);
						checkPoint();
						$loading.removeClass('doing');
						window.scrollTo(0,0);
						$('.calDateList li.on').removeClass('on');
						$('#'+onPathId).addClass('on');
						isDoingAjaxList=0;
					}, 10);
				}
			}
		});
	}

	var daySwipeCallback=function(linkId) {
		var $calPath=$('.calDateList ul'),
			date=linkId.replace('link',''),
			year=date.substr(0,4),
			month=date.substr(4,2);

		isDoingAjaxDate=1;

		if ((!isLoadSwipeData)&&((activeYear!==year)||(activeMonth!==month))) {
			isLoadSwipeData=true;
			//console.log('change');
			$('#date').html(year+'년 '+ cutZero(month)+'월');
			//$('.dim_weekSwipeDate').show();
			$.ajax({
				type: "GET",
				url: "/start/calendar/data/weekSwipeDate", // /trunk/Mobile/Jobkorea/NET_Root/starter/cal/data/swipe_date.html
				data: {Sel_Date: year+month},
				success: function(data, textStatus, jqXHR) {
					//alert(2);
					calDateList.destroy();
					$calPath.html(data);
					if (Number(year+month)==Number(limitDay)-1) {
						$calPath.find('li').each(function(i){
							if ($(this).attr('id').substr(4,6)==limitDay) {
								$(this).remove();
							}
						});
						$('.calDateList').addClass('on'); 
						$('.calDateList ul').css('width',$('.calDateList ul li').size()*51);
					} else {
						$('.calDateList').removeClass('on'); 
						$('.calDateList ul').css('width','');
					}
					$('#link'+moment(date, "YYYYMMDD").format("YYYYMM")+'01').find('span').eq(0).html(cutZero(moment(date, "YYYYMMDD").format("MM"))+'월'); // this month
					$('#link'+moment(date, "YYYYMMDD").add(1, 'months').format("YYYYMM")+'01').find('span').eq(0).html(cutZero(moment(date, "YYYYMMDD").add(1, 'months').format("MM"))+'월'); // next month
					$('#link'+moment(date, "YYYYMMDD").subtract(1, 'months').format("YYYYMM")+'01').find('span').eq(0).html(cutZero(moment(date, "YYYYMMDD").subtract(1, 'months').format("MM"))+'월'); // prev month
					$('#link'+o.toDay).addClass('today').find('span').eq(0).html('오늘');
					activeNum=$calPath.find('li').index($('#'+linkId));
					swiperOption.initialSlide=activeNum;
					calDateList=new Swiper('.calDateList', swiperOption);

					// if (activeYear!=year) {
					// 	//reflash
					// 	location.reload();
					// }

					activeYear=year;
					activeMonth=month;
					isLoadSwipeData=false;

					$('.calDateList li.on').removeClass('on');
					$('#'+onPathId).addClass('on');

					isDoingAjaxDate=0;
				}
			});
		} else {
			$('.calDateList li.on').removeClass('on');
			$('#'+onPathId).addClass('on');
			isDoingAjaxDate=0;
		}
	}
	init();
}
