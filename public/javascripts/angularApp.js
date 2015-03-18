(function() {
	var app = angular.module('help', []);

	app.controller('HelpPageController', function() {
		this.selectedPage = 0;
		this.goForward = function() { if(this.selectedPage < 5) this.selectedPage++; };
		this.goBackward = function() { if(this.selectedPage > 0) this.selectedPage--; };

		this.texts = [
			"The hinter chooses one of six random pictures from the internet and makes a hint about it. Making a hint costs two coins.",
			"Guessers use the hint to try to guess which picture was chosen.",
			"If the guesser guesses right, they get a coin!",
			"The hinter gets coins depending on how many of the guessers were correct. Their goal is to get as close to 50% as possible.",
			"If 50% guessers are right (±5%), the hint enters the Hall of Fame for people to guess forever! (Not yet implemented)" ];
		this.pages = [
			"images/help/page-1.gif", 
			"images/help/page-2.gif", 
			"images/help/page-3.gif", 
			"images/help/page-4.gif", 
			"images/help/page-5.gif" ];
	});
	app.controller('HintPageController', function() {
		this.revealed = false;
		this.showSubmitBox = function() { this.revealed = true; }
	})
})();