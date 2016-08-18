window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
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
