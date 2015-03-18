var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
var bodyparser = require('body-parser');
var session = require('express-session');
var cookieparser = require('cookie-parser');

var http = require('http');

var connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI;
var db = monk(connectionString);
//var db = monk('localhost:27017/testdb');

var urlList = db.get('testUrlList3');
var users = db.get('userlist');
var hintList = db.get('hintlist');
var guessList = db.get('guesslist');

router.use(cookieparser()); //this apparently has to be before session
router.use(session({secret: 'bobDoleKenning5535',
					saveUninitialized: true,
					resave: true }));
router.use(bodyparser());

//
//SPLASH
//
router.get('/', function(req, res) {
	res.render('splash', { 	title: 'Hinternet', 
							session: req.session });
});

//
//HINT, POST HINTSUBMIT, HINTSUCCESS
//
router.get('/hint', function(req, res){
	if (req.session.login) {
		urlList.findOne({_id:req.session.nextHintImgId},function(e, docs){
			console.log('next hintimgid = ' + req.session.nextHintImgId);
			res.render('hint', {title: 'Make a hint', 
								imgList: docs,
								session: req.session });
		});
	}
	else {
		res.redirect('/register');
	}
});
router.post('/hintSubmit', function(req, res){
	console.log('getting ready to submit a hint');
	if(req.session.login && inputSanitize(req.body.hint) &&
		(	req.body.group1 === '1' | req.body.group1 === '2' | 
			req.body.group1 === '3' | req.body.group1 === '4' | 
			req.body.group1 === '5' | req.body.group1 === '6' ) )
	{
		delete req.session.hintSubmitError;
		console.log('submitting a hint!');
		console.log('hint = ' + req.body.hint);
		console.log('selected image # ' + req.body.group1);
		console.log('imgList id = ' + req.session.nextHintImgId);

		urlList.findOne({_id:req.session.nextHintImgId}, function(err, imgUrls){
			console.log('starting the switch');
			switch(req.body.group1){
				case '1':
					var SelectedImg = imgUrls.ImgUrl1;
					break;
				case '2':
					var SelectedImg = imgUrls.ImgUrl2;
					break;
				case '3':
					var SelectedImg = imgUrls.ImgUrl3;
					break;
				case '4':
					var SelectedImg = imgUrls.ImgUrl4;
					break;
				case '5':
					var SelectedImg = imgUrls.ImgUrl5;
					break;
				case '6':
					var SelectedImg = imgUrls.ImgUrl6;
					break;
				default:
					console.log(error);
			}
			console.log('correct image = ' + SelectedImg);
			hintList.insert({	imgListId: req.session.nextHintImgId,
								author: req.session.login,
								hintText: req.body.hint,
								correctImage: req.body.group1,
								correctGuesses: 0,
								incorrectGuesses: 0,
								fullOfGuesses: false,
								fame: false,
								guessers: [req.session.login],
								correctImageUrl: SelectedImg }
			);		

			//update database entry as used
			// urlList.findOne({_id:req.session.nextHintImgId}, function(err, oldImgListDoc){
			// 	//BUG it should be used already!
			// 	console.log('updating urlList database entry as used');
			// 	oldImgListDoc.Unused = false;
			// 	urlList.update({_id:oldImgListDoc._id}, oldImgListDoc, function(){

					// urlList.findOne({Unused:true}, function(err, newImgListDoc){
			urlList.findOne({Unused:true}, function(err, newImgListDoc){

				newImgListDoc.Unused = false;

				urlList.update({_id:newImgListDoc._id}, newImgListDoc, function() {
					users.findOne({username:req.session.login}, function(err, userDoc){

						userDoc.coins = userDoc.coins -2;
						console.log("changing userDoc: the old imglistid was " + userDoc.nextHintImgId + " and the new one is " + newImgListDoc._id);
						console.log("its ImgUrl1 element returns " + newImgListDoc.ImgUrl1);
						userDoc.nextHintImgId = newImgListDoc._id;

						users.update({_id:userDoc._id}, userDoc, function(){
							console.log('updating user list and session info');
							req.session.nextHintImgId = newImgListDoc._id;
							req.session.coins = userDoc.coins;
							req.session.submittedHintImg = SelectedImg;
							req.session.submittedHint = req.body.hint;
							console.log('successfully submitted hint!');
							// urlList.findOne({ImgUrl1:newImgListDoc.ImgUrl1}, function(err, tryitoutDoc) {
							// 	console.log("Let's see if these are the same:" + tryitoutDoc._id + " and " + newImgListDoc._id);
							// });
							res.redirect('/hintSuccess');
						});
					});
				});
			});
				// });
			// });
		});
	}
	else {
		delete req.session.hintSubmitError;
		if(!inputSanitize(req.body.hint))
			req.session.hintSubmitError = "Please submit a valid hint under 26 characters, only using A-Z, 1-9, ! . and ?";
		if(req.body.group1 === 0 | !(req.body.group1))
			req.session.hintSubmitError = "Please choose an image before making a hint";
		if(!req.session.login && !inputSanitize(req.body.hint))
			req.session.hintSubmitError = "Please choose an image and submit a valid hint, only A-Z 1-9 and ?";
		res.redirect('back');
	}
});	
router.get('/hintSuccess', function(req, res){
	
	res.render('hintSuccess', {	title: 'Success!',
								session: req.session });
});

//
//GUESS, POST GUESS, GUESSSUCCESS
//
router.get('/guess', function(req, res){
	//MUST SEARCH FOR GUESSES THAT ARE NOT FULL 
	delete req.session.hintSubmitError;
	var goodGuess;
	var numberOfTries = 0;
	if(req.session.login) {
		hintList.find({fullOfGuesses: false},function(e, docs){
			if(e) res.redirect('/guessNone');
			else findGuess(docs);
		});
	}
	else res.redirect('/register');

	function findGuess(hintDocuments){
		numberOfTries++;
		console.log(numberOfTries);

		var randomnumber = Math.floor(Math.random()*hintDocuments.length);
		console.log('random number: ' + randomnumber);

		var currentDoc = hintDocuments[randomnumber]; 

		//check to see if guesser is the author
		if(currentDoc.author !== req.session.login){
			console.log('TESTING!');
			console.log(currentDoc.author + ' is the author. ' + req.session.login + ' is logged in.');
			//check to see if guesser has already guessed on this hint
			for(var j = 0; j <= currentDoc.guessers.length; j++)
			{
				console.log('currentdoc.guessers[' + j + '] is equal to ' + 
					currentDoc.guessers[j]);
				if(currentDoc.guessers[j] === req.session.login) 
					{
						console.log('ABANDON SHIP');
						break;
					}
				else{
					//make this the guess
					if(j === currentDoc.guessers.length) {
						console.log('havent guessed this yet!');
						goodGuess = currentDoc;
					}
				}
			}
		}
		if(goodGuess === currentDoc){
			console.log('going to render now!');
			urlList.findOne({_id:goodGuess.imgListId}, function(e, d){
				console.log(d);
				req.session.heldHintObject = goodGuess;
				req.session.heldHintUrlList = d;
				console.log('and the heldHintObject.author is' + req.session.heldHintObject.author);
				res.render('guess', {	title: 'Make a guess',
										imgList: d,
										session: req.session	});
			});
		}
		else{
			console.log('failed, lets see if we"re at 100 yet');
			if(numberOfTries === 100) res.render('guessNone', {title: "Make a guess",
																session: req.session });
			else findGuess(hintDocuments);
		}
	}
});
router.post('/guessSubmit', function(req, res){
	delete req.session.guessSubmitError;
	console.log('submitting a guess!');
	if(req.body.group1 !== null) {

		console.log('heldHintObject correctImage = ' + req.session.heldHintObject.correctImage);
		switch(req.session.heldHintObject.correctImage) {
		case '1':
			req.session.correctImage = req.session.heldHintUrlList.ImgUrl1;
			break;
		case '2':
			req.session.correctImage = req.session.heldHintUrlList.ImgUrl2;
			break;
		case '3':
			req.session.correctImage = req.session.heldHintUrlList.ImgUrl3;
			break;
		case '4':
			req.session.correctImage = req.session.heldHintUrlList.ImgUrl4;
			break;
		case '5':
			req.session.correctImage = req.session.heldHintUrlList.ImgUrl5;
			break;
		case '6':
			req.session.correctImage = req.session.heldHintUrlList.ImgUrl6;
			break;
		default:
			console.log(error);
		}
		console.log('correct image is ' + req.session.correctImage);
		console.log('heldHintObject author = ' + req.session.heldHintObject.author);
		switch(req.body.group1) {
		case '1':
			req.session.guessedImage = req.session.heldHintUrlList.ImgUrl1;
			break;
		case '2':
			req.session.guessedImage = req.session.heldHintUrlList.ImgUrl2;
			break;
		case '3':
			req.session.guessedImage = req.session.heldHintUrlList.ImgUrl3;
			break;
		case '4':
			req.session.guessedImage = req.session.heldHintUrlList.ImgUrl4;
			break;
		case '5':
			req.session.guessedImage = req.session.heldHintUrlList.ImgUrl5;
			break;
		case '6':
			req.session.guessedImage = req.session.heldHintUrlList.ImgUrl6;
			break;
		default:
			console.log(error);
		}
		console.log('user guessed ' + req.session.guessedImage)


		hintList.findOne({_id:req.session.heldHintObject._id}, function(e, hintDoc){	

			hintDoc.guessers.push(req.session.login);
			console.log('LIST OF ALL GUESSERS' + hintDoc.guessers);

			if(req.session.guessedImage === req.session.correctImage) {
				console.log('correct guess!');
				//get user doc, replace with same doc + 1 coin
				users.findOne({username: req.session.login}, function(e, userDoc){
					console.log('found the user!');
					userDoc.coins++;
					req.session.coins++;
					users.update({username: req.session.login}, userDoc, function(){
						//replace hint doc with same doc + 1 correct answer
						hintDoc.correctGuesses++;
						//if i want to make code to register all guesses ever made for each hint, 
						//here is where it would go. 
						req.session.lastGuess = false;
						hintList.update({_id:req.session.heldHintObject._id}, hintDoc, function(){
							console.log('redirecting...');
							res.redirect('/guessSuccess');
						});
					});
				});
			}
			else{
				console.log('incorrect guess!');
				//replace hint doc with same doc + 1 correct or incorrect answer
				hintDoc.incorrectGuesses++;
				hintList.update({_id:req.session.heldHintObject._id}, hintDoc, function(){
					console.log('redirecting...');
					res.redirect('/guessSuccess');
				})
			}
		});
	}
	else{
		if(req.body.group1 === null)
			req.session.guessSubmitError = "Please choose an image before guessing";
		res.redirect('back');
	}
});
router.get('/guessSuccess', function(req, res){
	res.render('guessSuccess', {title: 'Make a guess',
								session:req.session });
});
router.get('/guessNone', function(req, res){
	res.render('guessNone', {	title: 'Make a guess',
								session: req.session });
})

//
//HELP
//
router.get('/help', function(req, res){
	res.render('help', {title: 'How to play!',
						session: req.session });
});

//
//LOG IN/OUT
//
router.post('/login', function(req, res){
	console.log('Logging in');
	if(	req.body.usernameLogin !== "" &&
		req.body.passwordLogin !== "") {
		users.findOne({	username:req.body.usernameLogin, 
						password:req.body.passwordLogin}, function(err, doc){
			if(doc){
				req.session.login = req.body.usernameLogin;
				req.session.nextHintImgId = doc.nextHintImgId;
				req.session.coins = doc.coins;
				console.log("most recent hint = " + req.session.nextHintImgId);
			}
			else{
				req.session.loginError = 'Incorrect username or password';
			}
			res.redirect('back');
		})
	}
	else {
		if(req.body.usernameLogin === "")
			req.session.loginError = "Please provide a username";
		if(req.body.passwordLogin === "")
			req.session.passwordLoginError = "Please provide a password"
		res.redirect('back');
	}
});
router.get('/forget', function(req, res){
	if(req.session){
		req.session.destroy(function(err){
			if(err) console.log(err);
		});
	}
	res.redirect('/');
});
router.get('/userPage', function(req, res){
	hintList.find({author:req.session.login}, function(err, doc){
		if(err){ 
			console.log(err); 
		} else {
			console.log('going');
			console.log(doc);
			console.log(req.session.login);
			res.render('userPage', {title: 'User page', 
									session: req.session,
									createdHintList: doc });
		}
	});
});

//
//REGISTER
//
router.get('/register', function(req, res){
	res.render('register', {title: 'New user',
							session: req.session});
});
router.post('/register', function(req, res) {
	if(	inputSanitize(req.body.usernameSubmit) && 
		inputSanitize(req.body.passwordSubmit) &&
		req.body.passwordSubmit === req.body.passwordSecondSubmit &&
		inputSanitize(req.body.passwordHintSubmit)&&
		inputSanitize(req.body.passwordAnswerSubmit) )
	{
		users.findOne({username:req.body.usernameSubmit}, function(err, doc){
			if(doc){
				//go back to /register and say that the username is taken
				req.session.regenerate(function(err){
					req.session.usernameError= 'Username is taken';

					if(!inputSanitize(req.body.passwordSubmit))
						req.session.password1Error = 'Please enter a valid password';
					if(!inputSanitize(req.body.passwordSecondSubmit))
						req.session.password2Error = 'Please enter a valid password';
					if(req.body.passwordSubmit !== req.body.passwordSecondSubmit)
						req.session.password2Error = 'Passwords do not match';
					if(!inputSanitize(req.body.passwordHintSubmit))
						req.session.hintError = 'Please enter a valid security question';
					if(!inputSanitize(req.body.passwordAnswerSubmit))
						req.session.answerError = 'Please enter a valid answer to your question';
					res.redirect('/register');
				});
			}
			else
			{
				//create a new user
				urlList.findOne({Unused:true}, function(err, doc){
					doc.Unused = false;
					urlList.update({_id:doc._id}, doc, function() {
						console.log('Creating new user');
						console.log('Username: ' + req.body.usernameSubmit);
						console.log(doc);
						console.log("see, the doc is there.");
						users.insert(
							{	
								username: req.body.usernameSubmit,
								password: req.body.passwordSubmit,
								passwordHint: req.body.passwordHintSubmit,
								passwordAnswer: req.body.passwordAnswerSubmit,
								coins: 10,
								hallOfFame: 0,
								nextHintImgId: doc._id
							}, function(error, info){
								if(error) {
									console.log(error);
								} else {
									req.session.login = req.body.usernameSubmit;
									req.session.nextHintImgId = doc._id;
									req.session.coins = 10;

									doc.Unused = false;

									console.log('Done! Here is the doc: ' + doc);

									urlList.update({_id:doc._id}, doc);

									res.redirect('/register-confirm');
								}
							}
						);
					});
				});
			}
		});
	}
	else
	{
		req.session.regenerate(function(err){
			if(!inputSanitize(req.body.usernameSubmit))
				req.session.usernameError = "Please enter a valid username";
			if(!inputSanitize(req.body.passwordSubmit))
				req.session.password1Error = 'Please enter a valid password';
			if(!inputSanitize(req.body.passwordSecondSubmit))
				req.session.password2Error = 'Please enter a valid password';
			if(req.body.passwordSubmit !== req.body.passwordSecondSubmit)
				req.session.password2Error = 'Passwords do not match';
			if(!inputSanitize(req.body.passwordHintSubmit))
				req.session.hintError = 'Please enter a valid security question';
			if(!inputSanitize(req.body.passwordAnswerSubmit))
				req.session.answerError = 'Please enter a valid answer to your question';
			res.redirect('/register');
		});
	}
});
router.get('/register-confirm', function(req, res){
	res.render('registerConfirm', {	title: 'New user',
									session: req.session});
});

//
//UTILITIES
//
function inputSanitize(userInput){
	if(userInput.match(/^[ 0-9a-zA-Z?.!]{1,26}$/)) {
		console.log(userInput + " is valid");
		return true;
	}
	else return false;
}

module.exports = router;