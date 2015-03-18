$(document).ready(function () {
	var $bool=false;
	var selected = 0;
	//this makes the zoomed in image appear
   	$('.magnify').hover(
	 	function(){
			var tempSelectedImg = 'form label:nth-child(' + this.id*2 + ').imgbox img:nth-child(1)';
			console.log($(tempSelectedImg));
	    	$('*').stop();
	    	width = $(window).width();
     		$z = $("<div class='zoomContainer'><img class='zoom' src='" + 
     				$(tempSelectedImg).attr('src') + "'></div>");
 		    $('#bannerWrapper').after($z);
     		$('.gamecontainer div, .gamecontainer, .successContainer, .miniQueuePage').fadeTo('fast', .5);
     		$bool = true;
	 	}, function(){
		    if($bool)
		    {
		    	$('*').stop();
	    		$('*').not('input').fadeTo('fast', 1);
		    	$z.remove();
		    	$bool = false;
		    }
		}
	);

	//this lets you select stuff. they should be switched.
	$('.imgbox').mouseenter(
		function(){
			if(this.id !== selected)
			{
				$(this).stop();
				$(this).animate({
					backgroundColor: "#339933"
				}, 100);
			}
		}
	);
	$('.imgbox').mouseleave(
		function() {
			if(this.id !== selected)
			{
				$(this).stop();
				$(this).animate({
					backgroundColor: '#55aa55'
				}, 100);
			}
		}
	);
	$('.imgbox').not('.success').click(
		function(){
			var tempSelectedImg = 'form div:nth-child(' + this.id*2 + ').imgbox img:nth-child(1)';
			selected = this.id;

			$(this).animate(
			{
				backgroundColor:"#2d882d",
			    color:"#888888",
			    width:"150px"
			}, 	200);
			$('.' + this.id).not(".imgbox").animate(
			{
				width:"130px",
				"margin-left":"25px"
			}, {
			    duration: 200,
    			queue: true,
    		});
			$(tempSelectedImg).not('#submitBox').animate(
			{
				backgroundColor:"#2d882d",
			    color:"#888888",
			    width:"150px"
			}, {
			    duration: 200,
    			queue: false,
    		});

    					//return most stuff to its normal size
			$('.imgbox').not('#'+this.id).animate({
				backgroundColor:"#55aa55",
				width:'110px'
			}, 200);
			$('.imgSizedSpacer').not('.'+this.id).animate({
				width:'110px',
				"margin-left":"5px"
			}, 200);


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

