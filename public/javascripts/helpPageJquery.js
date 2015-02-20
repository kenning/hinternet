$(document).ready(function () {
	$(window).scroll(function(){
		if($(window).scrollTop() > 50){
			$('#a').css({
				'top': $(window).scrollTop() + 160
			});
		if($(window).scrollTop() > 560){
			$('#b').css({
				'top': $(window).scrollTop()+200
			});
		}
		if($(window).scrollTop() > 1060){
			$('#c').css({
				'top': $(window).scrollTop()+240
			});
		}
      if($(window).scrollTop() > 1560){
         $('#d').css({
            'top': $(window).scrollTop()+280
         });
      }
      if($(window).scrollTop() > 2060){
         $('#e').css({
            'top': $(window).scrollTop()+320
         });
		}
      if($(window).scrollTop() > 2550){
         $('#f').css({
            'top': $(window).scrollTop()+360
         });
      }
	} 
	});
});

