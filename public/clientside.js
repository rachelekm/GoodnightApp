'use strict';
let currentURL = window.location.href;;
let JWT_USER = '';

function displayAccountProfile(){
	$('#accountProfileWindow').show().append(`<div class="accountProfile">
		<button type='button' class='closeProfileWindow'>X</button>
		<h1>Username</h1>
		<h2>Account created:</h2>
		<h2>Number of Entries:</h2>
		</div>`);
}

function deleteEntryWarning(){
	$('#deleteEntryWarning').show().append(`Are you sure you want to delete this entry?
		<button type='button' class='deleteEntryConfirm'>YES</button>
		<button type='button' class='dontDeleteButton'>NO</button>`);
}


function filterReport(){
	//Used to search keywords/date/mood
}

function displayDreamReport(){
	$('#dreamReport').append(`div class=dreamSummary>
		<h1>Number of dreams recorded:</h1>
		<p></p>
		<h1>Most common dream symbols:</h1>
		<p></p></div>`);
}

function addNewDream(dream){
	MOCKDATA.dream_entries.push(dream);
	window.location.href = '/dreamlog.html';
}

function displayDreamLog(){
	if(MOCKDATA.dream_entries.length === 0){
		$('#dreamLog').append(`<div class='dreamEntry'>No results for this search</div>`);
	}
	else{
	MOCKDATA.dream_entries.forEach(object =>{
		let keywordsString = object.keywords.join(" ");
		$('#dreamLog').append(`<div class='dreamEntry'>
		<div class='dreamlogEntryButtons'>
			<button type="button" class='editEntryButton'>Edit</button>
			<button type="button" class='deleteEntryButton'>Delete</button>
		</div>
		<h3>${object.submitDate}</h3>
		<h4>Keywords:</h4>
		<p>${keywordsString}</p>
		<h4>Mood: ${object.mood}</h4>
		<h4>Dream Entry:</h4>
		<p>${object.content}</p>
		</div>`);
	});
	}
}

function displayNewEntryPage(){
	window.location.href = '/accounthomepage.html';
}

function updateJWT(data){
	//history.pushState({id: 'account-homepage'}, 'Account Homepage', '/newentry');
	JWT_USER = data.authToken;
	displayNewEntryPage();
}

function dreamReportPageListeners(){

}

function dreamLogPageListeners(){
	$('.dreamEntryForm').submit(event => {
		event.preventDefault();
		let newDream = $('input[name="dreamContentInput"]').val()
		let keywords = [];
		keywords.push($('input[name="dreamKeywordsInput1"]').val());
		keywords.push($('input[name="dreamKeywordsInput2"]').val());
		keywords.push($('input[name="dreamKeywordsInput3"]').val());
		let userMood = $('select option:selected').text();
		let newObject = {"_id": "1010101",
			"user": "UserSchemaNew",
			"submitDate": new Date(),
			"keywords": keywords,
			"mood": userMood, 
			"content": newDream
			};
		addNewDream(newObject);
	});
	$('.searchDreamKeywordsForm').submit(event => {
		event.preventDefault();
		$('#dreamLog').empty();
		let keywordSearch = $('input[name="dreamSearchKeywordInput"]').val();
		console.log(keywordSearch);
		displayDreamLog();
	});
	$('.searchDreamMoodForm').submit(event => {
		event.preventDefault();
		$('#dreamLog').empty();
		let moodSearch = $('input[name="dreamSearchMoodInput"]').val();
		console.log(moodSearch);
		displayDreamLog();
	});
	$('#dreamLog').on('click', '.editEntryButton', event =>{
		event.preventDefault();
		console.log('clicked edit');
	});
	$('#dreamLog').on('click', '.deleteEntryButton', event =>{
		event.preventDefault();		
		console.log('clicked delete');
		deleteEntryWarning();
	});
	$('#pageContents').on('click', '.deleteEntryConfirm', event =>{
		event.preventDefault();	
	});
	$('#pageContents').on('click', '.dontDeleteButton', event =>{
		event.preventDefault();	
		$('#deleteEntryWarning').empty().hide();
	});
	$(document).ready(function(){
		displayDreamLog();
	});
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
	$('#accountProfileWindow').on('click', '.closeProfileWindow', event => {
		event.preventDefault();
		$('#accountProfileWindow').hide().empty();
	})
}

function homePageButtonListeners(){
	navigationButtonListeners();
	dreamLogPageListeners();
	dreamReportPageListeners();
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