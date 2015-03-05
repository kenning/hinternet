$(document).ready(function () {
   $('.navButt, #submitBox, .bannerNavButton, .bannerLogoutButton').hover(function(){
      $(this).css('cursor', 'pointer');
      $(this).animate({
         backgroundColor: "#aaeeaa"
      }, 50);   
   }, function(){
      $(this).css('cursor', 'auto');
      if($(this).hasClass("navButt")) {
         $(this).animate({
            backgroundColor: "#55AA55"
         }, 50);            
      } else {
         $(this).animate({
            backgroundColor: "#88cc88"
         }, 50);            
      }
   });

   $('#guessLink').click(function(){
      window.location = '/guess';
   });
   $('#hintLink').click(function(){
      window.location = '/hint';
   });
   $('#userpageLink').click(function(){
      window.location = '/userPage';
   });
   $('#registerLink').click(function(){
      window.location = '/register';
   });
   $('.title').click(function(){
      window.location = '/';
   });
});

