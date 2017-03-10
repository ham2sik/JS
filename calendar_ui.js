/* html */
$(window).load(function(){
	jobCal({toDay : '20170204'}); // today값 개발 필요
});
/* //html */

var jobCal = function(options) {
	var defaults={
			toDay : '20170101' // default today
		},
		options=$.extend(defaults, options),
		o=options,
		limitDay=moment(o.toDay, "YYYYMMDD").add(5, 'months').format("YYYYMM"), // 4개월 후 월말까지
		activeYear=o.toDay.substr(0,4), // active year
		activeMonth=o.toDay.substr(4,2), // active month

		orcTopHeight=$('.orcTop').innerHeight(), // month area height
		calDateHeight=$('.calDateList').innerHeight(), // day swipe area height
		activeNum=$('.calDateList li').index($('#link'+o.toDay)), // day swipe active index number
		isLoadSwipeData=false,
		calDateList,

		contCount, // 리스트 갯수
		loadingTop, // list load ajax offset value
		orcOffset=[], // list cont offset

		$loading=$('.loading');

	console.log('today:'+o.toDay+', limitDay:'+limitDay);

	var init=function() {
		// url check
		if (queryString.date===undefined) {
			queryString.date=o.toDay;
		}
		$('#link'+queryString.date).addClass('on');

		checkPoint();
		setTimeout(function () {
			window.scrollTo(0,0);
			bindFn();
		}, 10);

		//month
		$('#date').html(activeYear+'년 '+ cutZero(activeMonth)+'월');
		//day swipe
		$('#link'+o.toDay).addClass('today').find('span').eq(0).html('오늘');
		swiperOption.initialSlide=$('.calDateList li').index($('.calDateList li.on'));
		calDateList=new Swiper('.calDateList', swiperOption);
	}

	var swiperOption={ // cal day swiper option
		initialSlide: 0,
		centeredSlides: true,
		slideToClickedSlide: true,
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
		loadingTop=$('.orcContByDate .orcCont').eq(contCount-3).offset().top;
		$('#orcArea .orcCont').each(function(i){
			orcOffset[i]=$(this).offset().top-(orcTopHeight+calDateHeight+2);
		});
	}



	var bindFn=function() {
		var orcTopTop=$('.orcTop').offset().top, // month area offset
			calDateTop=$('.calDateList').offset().top, // day swipe area offset
			$orcTop=$('.orcTop'),
			$calDateList=$('.calDateList'),
			$content=$('.content');

		/* scroll fn */
		$(window).on('scroll', function() {
			var scTop=$(window).scrollTop();

			/* top menu scroll fixed */
			if (scTop<orcTopTop) {
				$orcTop.removeClass('fixed');
				$calDateList.removeClass('fixed');
				$content.css('padding-top', '');
			} else if (scTop<calDateTop-orcTopHeight) {
				$orcTop.addClass('fixed');
				$calDateList.removeClass('fixed');
				$content.css('padding-top', orcTopHeight+1);
			} else {
				$orcTop.addClass('fixed');
				$calDateList.addClass('fixed');
				$content.css('padding-top', orcTopHeight+calDateHeight+2);
			}

			/* month, day swipe */
			var scTopId=$('.orcContByDate .orcCont').eq(arrayCheck(scTop)).attr('id');
			if (scTopId!==undefined) {
				var calId=scTopId.replace('list','link'),
					activeDateIdIndex=$('.calDateList li').index($('#'+calId));

				// if ((activeYear!==scTopId.substr(4,4))||(activeMonth!==scTopId.substr(8,2))) {
				// 	daySwipeCallback(calId);
				// }

				calDateList.slideTo(activeDateIdIndex, 100);
				setTimeout(function () {
					$('.calDateList li.on').removeClass('on');
					$('.calDateList li').eq(activeDateIdIndex).addClass('on');
				}, 110);
			}

			/* list */
			if ($loading.hasClass('done')) {
				return false;
			}
			if ((scTop>=loadingTop)&&(!$loading.hasClass('doing'))) {
				$loading.addClass('doing');
				loadList(moment($('.orcContByDate .orcCont').eq(contCount-1).attr('id').replace('list',''), "YYYYMMDD").add(1, 'days').format("YYYYMMDD"), 'scroll');
			}
		});

		/* day swipe click fn */
		$('.calDateList').on('click', 'a', function(e) {
			var clickedDate=$(this).parent().attr('id').replace('link',''),
				$listId=$('#list'+clickedDate),
				$listLi=$(this).parent();

			/* day swipe */
			calDateList.slideTo($('.calDateList li').index($listLi), 100);
			setTimeout(function () {
				$('.calDateList li.on').removeClass('on');
				$('#link'+clickedDate).addClass('on');
			}, 110);

			/* list */
			if ($listId.length) {
				setTimeout(function () {
					window.scrollTo(0,$listId.offset().top-orcTopHeight-calDateHeight-2);
				}, 10);
			} else {
				loadList(clickedDate, 'click');
			}

			/* url */
			var renewURL = location.href;
			renewURL = renewURL.replace(/\?date=([0-9]+)/ig,'');
			renewURL += '?date='+clickedDate;
			// history.pushState(null, null, renewURL);
			history.replaceState(null, null, renewURL);

			e.preventDefault();
		});

		/* month prev click fn */
		$('.sltYear .button.left').on('click', function(e) {
			var dateId='link'+moment(activeYear+activeMonth, "YYYYMM").subtract(1, 'months').format("YYYYMM")+'01';
			daySwipeCallback(dateId);
			$('#'+dateId).find('a').trigger('click');
			e.preventDefault();
		});
		/* month next click fn */
		$('.sltYear .button.right').on('click', function(e) {
			var date=moment(activeYear+activeMonth, "YYYYMM").add(1, 'months').format("YYYYMM"),
				dateId='link'+date+'01';
			if (Number(date)<Number(limitDay)) {
				daySwipeCallback(dateId);
				$('#'+dateId).find('a').trigger('click');
			} else {
				alert("오늘 이후 4개월까지 확인 가능합니다.");
			}
			e.preventDefault();
		});

		$('.goToday').on('click', function() {
			var $listId=$('#list'+o.toDay),
				linkId='link'+o.toDay,
				$linkId=$('#'+linkId);

			if ($listId.length) {
				setTimeout(function () {
					window.scrollTo(0,$listId.offset().top-orcTopHeight-calDateHeight-2);
				}, 10);
				if (!$linkId.length) {
					daySwipeCallback(linkId);
				}
				var activeDateIdIndex=$('.calDateList li').index($linkId);
				calDateList.slideTo(activeDateIdIndex, 100);
				setTimeout(function () {
					$('.calDateList li.on').removeClass('on');
					$('.calDateList li').eq(activeDateIdIndex).addClass('on');
				}, 110);
			} else {
				var todayId='link'+o.today;
				daySwipeCallback(todayId);
				$('#'+todayId).find('a').trigger('click');
			}
		});
	}

	var loadList=function(date, motion) {
		var $path=$('.orcContByDate');

		$.ajax({
			type: "GET",
			url: "/cal/data/list",
			data: {date: date},
			success: function(data, textStatus, jqXHR) {
				if (motion=='scroll') {
					if (Number(date.substr(6,2))>22) {
						if (!$('.dataCheckArea').length) {
							$('body').append('<div class="dataCheckArea"></div>');
						}
						$('.dataCheckArea').html(data);
						$('.dataCheckArea .orcCont').each(function(i){
							if (Number($(this).attr('id').substr(4,6))>=Number(limitDay)) {
								$(this).remove();
								//console.log('done');
								$loading.addClass('done');
							}
						});
						data=$('.dataCheckArea').html();
					}
					$path.append(data);
				} else if (motion=='click') {
					$path.html(data);
					$loading.removeClass('done');
				}
				checkPoint();

				// if (contCount>14) { list data 삭제 조건
				// }

				$loading.removeClass('doing');
				if (motion=='click') {
					setTimeout(function () {
						window.scrollTo(0,$('#link'+date).offset().top-orcTopHeight-calDateHeight-2);
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

		if (!isLoadSwipeData) {
			if ((activeYear!==year)||(activeMonth!==month)) {
				isLoadSwipeData=true;
				//console.log('change');
				$('#date').html(year+'년 '+ cutZero(month)+'월');
				$.ajax({
					type: "GET",
					url: "/cal/data/swipe_date", 
					data: {date: year+month},
					success: function(data, textStatus, jqXHR) {
						calDateList.destroy();
						$calPath.html(data);
						if (Number(year+month)==Number(limitDay)-1) {
							$calPath.find('li').each(function(i){
								if ($(this).attr('id').substr(4,6)==limitDay) {
									$(this).remove();
								}
							});
						}
						$('#link'+o.toDay).addClass('today').find('span').eq(0).html('오늘');
						activeNum=$calPath.find('li').index($('#'+linkId));
						swiperOption.initialSlide=activeNum;
						calDateList=new Swiper('.calDateList', swiperOption);

						activeYear=year;
						activeMonth=month;
						isLoadSwipeData=false;
					}
				});
			}
		}
	}
	init();
}
