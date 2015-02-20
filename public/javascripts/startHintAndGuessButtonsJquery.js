$(document).ready(function () {
   $('.navButt, .bannerNavButton, .bannerLogoutButton').hover(function(){
      $(this).css('cursor', 'pointer');
   }, function(){
      $(this).css('cursor', 'auto');
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

