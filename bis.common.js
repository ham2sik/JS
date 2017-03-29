window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};
/* random list */
var randomList = []; 
var randomNum;
var listSize=10;
while(randomList.length < listSize){
	randomNum = Math.floor(Math.random()*Number(listSize));console.log('randomNum:'+randomNum+', index:'+randomList.indexOf(randomNum));
	if(randomList.indexOf(randomNum) < 0){
		randomList.push(randomNum);
	}
	console.log('loop', ++loopCount);
}
console.log(randomList);

/* line-clamp */
function fontChk(el) {
	var $el=$(el);

	$el.find('.line2Wrap').each(function() {
		var $wrap=$(this),
			wrapHeight=$wrap.height(),
			$target=$wrap.children('.listTxtWrap'),
			targetHeight=$target.height(),
			$txt=$target.children('.listTxt02'),
			txtVal=$txt.html();

		if (!$wrap.hasClass('done')) {
			if (targetHeight > wrapHeight) {
				while (targetHeight > wrapHeight) {
					txtVal=txtVal.substr(0, txtVal.length-1);
					$txt.html(txtVal+'...');
					targetHeight=$target.height();
					console.log(txtVal+' , '+targetHeight+' , '+wrapHeight);
				}
				$wrap.addClass('done');
			} else {
				$wrap.addClass('done');
			}
		}
	});
}

/* parameter fn - ex)QueryString.listNo */
var QueryString = function () {
	var query_string = {},
		query = window.location.search.substring(1);
		vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = decodeURIComponent(pair[1]);
		// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
			query_string[pair[0]] = arr;
		// If third or later entry with this name
		} else {
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	}
	return query_string;
}();

var listHeightResize = function($elem) { // var $list = $('#partSearch .rstList'); listHeightResize($('#partSearch .rstList'));
	var $li=$elem.find('li'),
		liSize=$li.size(),
		heightChk01,
		heightChk02;
	liSize--;
	//console.log(liSize);
	for (i=0; i<=liSize; i=i+2) {
		if (i+1>liSize) {
			break;
		}
		heightChk01=$li.eq(i).height();
		heightChk02=$li.eq(i+1).height();
		//console.log(i+', '+heightChk01+', '+heightChk02);
		if (heightChk01>heightChk02) {
			$li.eq(i+1).height(heightChk01);
		} else {
			$li.eq(i).height(heightChk02);
		}
	}
}

/* find dom fn(not use jquery) */
var $=function(elem) {
	var dom=document.querySelectorAll(elem),
		rtnVal=null;
	if (dom.length==0) rtnVal=undefined;
	if (dom.length==1) rtnVal=dom[0];
	if (dom.length>1) rtnVal=dom;
	return rtnVal; 
};

function preloadImg() {
	var imgs=[];

	for (var i=1;i<arguments.length;i++) {
		imgs[i]=new Image();
		imgs[i].src=arguments[0]+arguments[i];
	}
}

function randomNo(min,max) {
	var selectNo=Math.floor(Math.random()*(max-min+1))+min;
	return selectNo;
}

var animateDoing=0;

(function($){
	$.fn.extend({
		chgImg: function(options) {// plugin name
			var defaults={//Settings list and the default values
				off: 'off',
				on: 'on'
			};

			var options = $.extend(defaults, options);
			
			return this.each(function() {
				var o=options;
				//console.log('off:'+o.off+' , on:'+o.on);
				var obj=$(this);
				var src=$(this).attr('src');
				var type_off=src.indexOf('_'+o.off+'.');
				var type_on=src.indexOf('_'+o.on+'.');
				if (type_off!=-1){
					obj.attr("src", src.replace("_"+o.off, "_"+o.on));
				} else if (type_on!=-1){
					obj.attr("src", src.replace("_"+o.on, "_"+o.off));
				}
			});
		},
		animateImg: function(options) {// plugin name
			var defaults={//Settings list and the default values
				time: 100/3,
				duration: '20',
				direction: 'forward', // forward, reverse
				end: '080',
				btn_prev: 'btn_prev',
				btn_next: 'btn_next'
			};
			
			var options = $.extend(defaults, options);
		   
			return this.each(function() {
				var o=options;

				var obj=$(this);
				var src=$(this).attr("src");
				var cutExt=src.split(".")[0];
				var startNum=cutExt.slice("-3");// 3자리
				var nextNum=Number(startNum);
				var timer;
				
				function chk(num) {
					if (o.direction=="forward") {
						if (num>Number(o.end)) {
							num=num-Number(o.end);
						}
					} else {
						if (num<0) {
							num=num+Number(o.end);
						}
					}
					num="000"+num;
					num=num.slice("-3");

					return num;
				}

				animateDoing=1;

				if (o.direction=="forward") {
					var endNum=Number(startNum)+Number(o.duration);
				} else {
					var endNum=Number(startNum)-Number(o.duration);
				}
				endNum=chk(endNum);

				timer=setInterval(function () {
					if (o.direction=="forward") {
						nextNum++;
						nextNum=chk(nextNum);
						obj.attr("src", src.replace(startNum+".", nextNum+"."));
						if (Number(nextNum)==Number(endNum)) {
							clearInterval(timer);
							animateDoing=0;
						}
					} else {
						nextNum--;
						nextNum=chk(nextNum);
						obj.attr("src", src.replace(startNum+".", nextNum+"."));
						if (Number(nextNum)==Number(endNum)) {
							clearInterval(timer);
							animateDoing=0;
						}
					}
				}, o.time);
			});
		}
	});
})(jQuery);
