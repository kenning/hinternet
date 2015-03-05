$(document).ready(function () {
	$(window).scroll(function(){

		var scroll = $(window).scrollTop();
		if(scroll > 50){
			$('#a').css({
				'top': scroll + 160
			});
		}
		if(scroll > 130) {
			$('#scrollDownDialog').animate({
				'opacity': 0}
			);
		}
		if(scroll > 460){
			$('#b').css({
				'top': scroll+200
			});
		}
		if(scroll > 860){
			$('#c').css({
				'top': scroll+240
			});
		}
	    if(scroll > 1260){
	       $('#d').css({
	          'top': scroll+280
	       });
	    }
	    if(scroll > 1660){
	       $('#e').css({
	          'top': scroll+320
	       });
		}
	    if(scroll > 2050){
	       $('#f').css({
	          'top': scroll+360
	       });
	  	}
	});
});

