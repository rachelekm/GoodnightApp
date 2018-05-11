'use strict';
let currentURL = window.location.href;
let currentPATH = window.location.pathname;
let user_USERNAME = '';

//client-side: finish dream report

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

function findMostCommonMood(mockDataWithSymbol){
	let allMoods = [];
	let uniqueMoods = [];
	let countedMoods = [];
	mockDataWithSymbol.forEach(object => {
		object.mood.forEach(item => {
			allMoods.push(item);
		});
	});
	console.log(allMoods);
	uniqueMoods = [...new Set(allMoods)];
	uniqueMoods.forEach(item => {
		countedMoods.push({mood: item, count: 0});
	});
	allMoods.forEach(item => {
		countedMoods.forEach(object => {
			if(item === object.mood){
				object.count += 1;
			}
		});
	});

	let finalArray = countedMoods.sort(highestCount).map(object => {
		return object.mood;
	})

return finalArray;
}

function displaySymbolDetails(data, symbol, index){
	//GET INFO FILTERED BY SYMBOL
	let mockDataWithSymbol = [];
	data.forEach(object=> {
		object.keywords.forEach(item=>{
			if(item === symbol){
				mockDataWithSymbol.push(object);
			}
		});
	});
	let moodArray = findMostCommonMood(mockDataWithSymbol);
	let moodArrayString = moodArray[0];
	if(moodArray.length > 0){
		moodArrayString = moodArray.join(", ");
	}
	$('#dreamReport').find(`.dreamSymbols .symbolsMoreInfoBox${index}`).empty().addClass('moreInfoCSS').append(
		`<h4>Most likely dreamt of ${symbol} when feeling: ${moodArrayString}</h4>
		<h4 class='dates'>Dates:</h4>
		<button type='button' role='button' class='viewDreamSymbolsLog'>View Dreams with ${symbol}</button>`);
	mockDataWithSymbol.forEach(object=> {
		let dateString = object.submitDate.split(' ', 4).join(" ");
		$('#dreamReport').find(`.symbolsMoreInfoBox${index} .dates`).append(
			`<p>${dateString}</p>`);	
	});
}

function highestCount(a, b){
  if (a.indexFound < b.indexFound) { return -1; }
  if (a.indexFound > b.indexFound) { return 1; }
  return 0;
}

function findMostCommonKeywords(dreams){
	let allKeywords = [];
	let uniqueKeywords = [];
	let countedKeywords = [];
	dreams.forEach(object => {
		object.keywords.forEach(item => {
			allKeywords.push(item);
		});
	});
	uniqueKeywords = [...new Set(allKeywords)];
	uniqueKeywords.forEach(item => {
		countedKeywords.push({keyword: item, count: 0});
	});
	allKeywords.forEach(item => {
		countedKeywords.forEach(object => {
			if(item === object.keyword){
				object.count += 1;
			}
		});
	});

return countedKeywords.sort(highestCount);
}

function displayDreamReport(data){
	console.log(data);
	let keywords = findMostCommonKeywords(data);
	let numKeywords = keywords.length;
	$('#dreamReport').append(`<div class='dreamSummary'>
		<h1>Number of dreams recorded:</h1>
		<p>${data.length}</p>
		<h1>Most common dream symbols:</h1>
		</div>`);
	if(numKeywords > 5){
		$('#dreamReport').append(`<div class='dreamSymbols'></div>
			<button type='button' role='button' class='seeMoreKeywordsReport'>See More</button>`);
		for(let i =0; i < 5; i++){
			$('#dreamReport').find('.dreamSymbols').append(
				`<div class='symbolBox'><p>${keywords[i].keyword}</p>
				<button type='button' role='button' class='extraSymbolInfo'>See More</button></div><div class='symbolsMoreInfoBox${i}' hidden></div>`);
		}
		for(let i =5; i < numKeywords; i++){
			$('#dreamReport').find('.dreamSymbols').append(
				`<div class='symbolBox next5'><p>${keywords[i].keyword}</p>
				<button type='button' role='button' class='extraSymbolInfo'>See More</button></div><div class='symbolsMoreInfoBox${i}' hidden></div>`);
		}
	}
	else {
		$('#dreamReport').append(`<div class='dreamSymbols'></div>`);
		for(let i =0; i < numKeywords; i++){
			$('#dreamReport').find('.dreamSymbols').append(
				`<div class='symbolBox'><p>${keywords[i].keyword}</p>
				<button type='button' role='button' class='extraSymbolInfo'>See More</button></div><div class='symbolsMoreInfoBox${i}' hidden></div>`);
		}
	}
}

function displayDreamLogFILTER(data, type){
	$('#dreamLog').empty();
	if(data.length === 0){
		$('#dreamLog').append(`<div class='dreamEntry'>No results for this search</div>`);
	}
	else if(type==='mood'){
	data.forEach(object =>{
		let keywordsString = object.keywords.join(", ");
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
	else if(type==='keyword'){
		data.forEach(object =>{
		let keywordsString = object.keywords.join(", ");
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

function displayDreamLog(data){
	console.log(data);
	if(data.length === 0){
		$('#dreamLog').append(`<div class='dreamEntry'>No results for this search</div>`);
	}
	else{
	data.reverse().forEach(object =>{
		let keywordsString = object.keywords.join(", ");
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

function getDreamData(){
	if(currentPATH === '/dreams/dream-log'){
	$.getJSON(`${currentURL}-all`, function(data){
		displayDreamLog(data);
	});
	}
}

function setJWTHeader(xhr) {
    xhr.setRequestHeader('Authorization', 'Bearer '+ localStorage.getItem('JWT_USER'));
    xhr.setRequestHeader('Content-Type', 'application/json');
}

function displayNewEntryPage(){
	history.pushState(null, null, '/dreams');
	currentURL = window.location.href;
	location.reload();
}

function updateJWT(data){
	localStorage.setItem('JWT_USER', data.authToken);
	displayNewEntryPage();
}

function dreamReportPageListeners(){
	let dreams;
	if(currentPATH === '/dreams/dream-report'){
		$.getJSON(`${currentURL}-all`, function(data){
			dreams = data;
			displayDreamReport(data);
		});
	}
	$('#dreamReport').on('click', '.seeMoreKeywordsReport', function(){
		$('#dreamReport').find('.seeMoreKeywordsReport').hide();
		$('#dreamReport').find('.dreamSymbols .next5').removeClass('next5');
	});
	$('#dreamReport').on('click', '.symbolBox', function(){
		//$('#dreamReport').find('.dreamSymbols .symbolsMoreInfoBox').not(this).hide();
		$(this).next('div').toggle();
		let index = $(this).next('div').attr('class').slice(-1);
		console.log(index);
		let targetSymbol = $(this).find('p').text();
		displaySymbolDetails(dreams, targetSymbol, index);
	})
	$('#dreamReport').on('click', '.viewDreamSymbolsLog', function(){
		/*setTimeout(function(){
			$('#dreamLog').empty();
			let symbolSearch = $(this).text().split(' ');
			let string = symbolSearch.slice(3, symbolSearch.length).join(' ');
			displayDreamLogFILTER(string, 'keyword');
		}, 5000);
				window.location.href = '/dreamlog.html';*/

	});
}

function dreamLogPageListeners(){
	getDreamData();
	$('.searchDreamKeywordsForm').submit(event => {
		event.preventDefault();
		$('#dreamLog').empty();
		let keywordSearch = $('input[name="dreamSearchKeywordInput"]').val();
		console.log(keywordSearch);
		$.ajax({
			method: 'POST',
			url: currentURL,
			data: JSON.stringify({"searchKey": keywordSearch}), 
			success: function(data){
				displayDreamLogFILTER(data, 'keyword');
			},
			error: function(err){
				console.log(err);
			},
			dataType: 'json',
			beforeSend: setJWTHeader
		});
	});
	$('.searchDreamMoodForm').submit(event => {
		event.preventDefault();
		$('#dreamLog').empty();
		let moodSearch = $('input[name="dreamSearchMoodInput"]').val();
		moodSearch = moodSearch.charAt(0).toUpperCase() + moodSearch.slice(1);
		console.log(moodSearch);
		$.ajax({
			method: 'POST',
			url: currentURL,
			data: JSON.stringify({"searchMood": moodSearch}), 
			success: function(data){
				displayDreamLogFILTER(data, 'mood');
			},
			error: function(err){
				console.log(err);
			},
			dataType: 'json',
			beforeSend: setJWTHeader
		});
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
}

function newEntryPageListeners(){
	$('.moreInfoButton').on('click', event => {
		event.preventDefault();
		$('input[name="dreamContentInput"]').animate({height:'100px'});
		$('.moreInfoButton').hide();
		$('.moreInfoForm').toggle();
		$('.submitButton').toggle();
	});
	$('.dreamEntryForm').submit(event => {
		event.preventDefault();
		let newDream = $('input[name="dreamContentInput"]').val();
		let keywords = [];
		keywords.push($('input[name="dreamKeywordsInput1"]').val());
		keywords.push($('input[name="dreamKeywordsInput2"]').val());
		keywords.push($('input[name="dreamKeywordsInput3"]').val());
		let userMood = $('select option:selected').text();
		let newDate = new Date()
		//must break out mood into array in case of mult selections
		let newObject = {
			"submitDate": newDate.toString(),
			"keywords": keywords,
			"mood": [userMood], 
			"content": newDream
			};
		console.log(newObject);
		$.ajax({
			method: 'POST',
			url: currentURL,
			data: JSON.stringify(newObject), 
			success: function(data){
				history.pushState(null, null, '/dreams/dream-log');
				currentURL = window.location.href;
				location.reload();
			},
			error: function(err){
				console.log(err);
			},
			dataType: 'json',
			beforeSend: setJWTHeader
		});
	});
}

function navigationButtonListeners(){
	$('.accountProfileNavButton').on('click', function(event){
		history.pushState(null, null, window.location.href + '/accountprofile');
		//history.pushState({id: 'account-profile'}, 'Account Profile', '/accountprofile');
		currentURL = window.location.href;
		displayAccountProfile();
	});
	$('#accountProfileWindow').on('click', '.closeProfileWindow', event => {
		event.preventDefault();
		$('#accountProfileWindow').hide().empty();
		let newPath = window.location.pathname.split('/')[1];
		console.log(newPath);
		history.pushState(null, null, `/${newPath}`);
		currentURL = window.location.href;
	});
	$('.navigationBar').on('click', '.dreamLogNavButton', function(event){
		event.preventDefault();
		//event.preventDefault();
		//history.pushState({id: 'dream-log'}, 'Dream Log', '/dream-log');
		//GET LAST 10 dream entries
		//console.log('dream log works');
		history.pushState(null, null, '/dreams/dream-log');
		currentURL = window.location.href;
		location.reload();
	});
	$('.navigationBar').on('click', '.dreamReportNavButton', function(event){
		event.preventDefault();
		history.pushState(null, null, '/dreams/dream-report');
		currentURL = window.location.href;
		location.reload();
	});
	$('.navigationBar').on('click', '.newEntryNavButton', function(event){
		event.preventDefault();
		history.pushState(null, null, '/dreams');
		currentURL = window.location.href;
		location.reload();
	});
}

function homePageButtonListeners(){
	navigationButtonListeners();
	newEntryPageListeners();
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
		user_USERNAME = $('input[aria-label="sign-up-form-username-input"]').val();
		let password = $('input[aria-label="sign-up-form-password-input"]').val();
		console.log(currentURL);
		$.ajax({
			method: 'POST',
			url: currentURL,
			data: JSON.stringify({username: user_USERNAME, password: password}), 
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
		user_USERNAME = $('input[aria-label="login-form-username-input"]').val();
		console.log(user_USERNAME);
		let password = $('input[aria-label="login-form-password-input"]').val();
		console.log(currentURL);
		$.ajax({
			method: 'POST',
			url: currentURL,
			data: JSON.stringify({username: user_USERNAME, password: password}), 
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