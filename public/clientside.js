'use strict';
let currentURL = window.location.href;;
let JWT_USER = '';

function displayAccountProfile(){
	$('#accountProfile').show().html(`<div class="accountProfile"><h1>Username</h1></div>`);
}

function displayDreamLog(){
//DISPLAY LAST 10 DREAM ENTRIES
	//$('#pageContents').load('dreamlog.html');
	//$('.dreamLogContainer').html("It's working!");
	/*MOCKDATA.dream_entries.forEach(object=> {
		let newDate = `${object.submitDate.split()[1]} ${object.submitDate.split()[2]}, ${object.submitDate.split()[3]}`;
		let setClassName = object._id;
		$('.dreamLogContainer').append(`<div class='${setClassName}'>
			<div class='dreamlogEntryButtons'>
			<button type="button" class='editEntryButton'>Edit</button>
			<button type="button" class='deleteEntryButton'>Delete</button>
			</div>
			<h3>${newDate}</h3>
			<h4>Keywords:</h4>
			<h4>Mood: ${object.mood}</h4>
			<h4>Dream Entry:</h4>
			<p>${object.content}</p>
			</div>`);
	});*/
	history.pushState({id: 'dream-log'}, 'Dream Log Page', '/dreamlog');
}

function displayNewEntryPage(){
	window.location.href = '/accounthomepage.html';
}

function updateJWT(data){
	//history.pushState({id: 'account-homepage'}, 'Account Homepage', '/newentry');
	JWT_USER = data.authToken;
	displayNewEntryPage();
} 

function navigationButtonListeners(){
	$('.accountProfileNavButton').on('click', function(event){
		history.pushState({id: 'account-profile'}, 'Account Profile', '/accountprofile');
		currentURL = window.location.href;
		displayAccountProfile();
	});
	$('.navigationBar').on('click', '.dreamLogNavButton', function(event){
		history.pushState({id: 'dream-log'}, 'Dream Log', '/dream-log');
		//GET LAST 10 dream entries
		displayDreamLog();
	});
	$('.dreamReportNavButton').on('click', function(event){
		history.pushState({id: 'dream-report'}, 'Dream Report', '/dream-report');
		currentURL = window.location.href;
	});
	$('.newEntryNavButton').on('click', function(event){
		history.pushState({id: 'new-entry'}, 'New Entry Page', '/newentry');
		currentURL = window.location.href;
		displayNewEntryPage();
	});
}

function homePageButtonListeners(){
	navigationButtonListeners();
	$('.createAccountButton').on('click', event => {
		$('.loginForm').hide();
		$('.signUpForm').toggle();
		history.pushState({id: 'sign-up'}, 'Create Account', '/signup');
		currentURL = window.location.href;
	});
	$('.loginAccountButton').on('click', event => {
		$('.signUpForm').hide();
		$('.loginForm').toggle();
		history.pushState({id: 'login'}, 'Account Login', '/login');
		currentURL = window.location.href;
	});
	$('.signUpForm').submit(event => {
		event.preventDefault();
		let username = $('input[aria-label="sign-up-form-username-input"]').val();
		let password = $('input[aria-label="sign-up-form-password-input"]').val();
		console.log(currentURL);
		$.ajax({
			method: 'POST',
			url: currentURL,
			data: JSON.stringify({username: username, password: password}), 
			success: function(data){
				updateJWT(data);
			},
			error: function(err){
				console.log(err);
			},
			dataType: 'json',
			contentType: 'application/json'
		});
	});

	$('.loginForm').submit(event => {
		event.preventDefault();
		let username = $('input[aria-label="login-form-username-input"]').val();
		let password = $('input[aria-label="login-form-password-input"]').val();
		console.log(currentURL);
		$.ajax({
			method: 'POST',
			url: currentURL,
			data: JSON.stringify({username: username, password: password}), 
			success: function(data){
				updateJWT(data);
			},
			error: function(err){
				console.log(err);
			},
			dataType: 'json',
			contentType: 'application/json'
		});
	});
}

$(homePageButtonListeners);