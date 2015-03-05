$(document).ready(function () {
	var $bool=false;
	var selected = 0;
   	$('.hintimg, .successImage').mouseenter(
	 	function(){
		    if($bool === false){
		    	$('*').stop();
		    	width = $(window).width();
	     		$z = $("<div class='zoomContainer'><img class='zoom' src='" + 
	     				$(this).attr('src') + "'></div>");
	 		    $('#bannerWrapper').after($z);
	     		$('.gamecontainer div, .gamecontainer, .successContainer, .miniQueuePage').fadeTo('fast', .5);
	     		$bool = true;
	 		}
	 	}
 	);
    $(document).on('mouseleave', 'img', 
    	function(){
		    if($bool)
		    {
	    		$('*').not('input').fadeTo('fast', 1);
		    	$z.remove();
		    	$bool = false;
		    }
		}
	);
	$('label.selbox').mouseenter(
		function(){
			if(this.id !== selected)
			{
				$(this).animate({
					backgroundColor: "#339933"
				}, 100);
			}
		}
	);
	$('label.selbox').mouseleave(
		function() {
			if(this.id !== selected)
			{
				$(this).animate({
					backgroundColor: '#55aa55'
				}, 100);
			}
		}
	);
	$('label.selbox').click(
		function(){
			var tempSelectedImg = 'form div:nth-child(' + this.id + ')';
			selected = this.id;
			//if an image is selected, deselects it and its select box
			$('.imgbox').animate({
				backgroundColor:"#55aa55",
				width:'110px'
			}, 200);
			$('.selbox').animate({
				backgroundColor:"#55aa55",
				width:'110px'
			}, 200);
			//This selection box and its image both stop animating 
			$(this).stop();
			$(tempSelectedImg).stop();
			$(this).animate(
			{
				backgroundColor:"#2d882d",
			    color:"#888888",
			    width:"150px"
			}, 	200, function(){ 
				//text flash
				$(this).animate(
					{
						color:'#000000'
					}
				, 500);
			});
			//animate this (.selbox) and tempselectedimg
			$(tempSelectedImg).not('#submitBox').animate(
			{
				backgroundColor:"#2d882d",
			    color:"#888888",
			    width:"150px"
			}, 	200);
		}
	);
	$('#submitBox').click(
		function(){
			$(this).animate(
			{
				backgroundColor:"#2d882d",
			    color:"#888888",
			}, 	200, function(){ 
				//text flash
				$(this).animate(
					{
						color:'#000000',
						backgroundColor: '#55aa55'
					}
				, 500);
			});	
	});
});

