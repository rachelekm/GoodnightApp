'use strict';
let currentURL = window.location.href;
let currentPATH = window.location.pathname;
let user_USERNAME = '';

//client-side: finish dream report, fix PUT endpoint error

function getEndpoint(){
	let API_ENDPOINT = window.location.href.split("/");
	let refreshPath = API_ENDPOINT.pop();
	return `${API_ENDPOINT.join('/')}/dreams`;
}

function makePrettyDate(data){
	let date = new Date(data);
 	return `${date.toString().substring(0,3)} ${date.toLocaleDateString()}`;
}

function updateCalendar(symbol, dataArray){
	let eventsArray = dataArray.map(object => {
		return {
			title: `${symbol}`,
			start: `${object.submitDate.slice(0, 10)}`,
			allDay: true,
			textColor: 'white'
		};
	});
	return eventsArray;
}

function displayAccountProfile(data){
	console.log(data, 'in account profile function');
	let newDate = makePrettyDate(data.accountCreated);
	$('#accountProfileWindow').show().append(`<div class="accountProfile">
		<button type='button' class='closeProfileWindow'>X</button>
		<h1>${data.username}</h1>
		<h2>${data.firstName} ${data.lastName}</h2>
		<h2>Member since: ${newDate}</h2>
		<button type='button' class='logOutOfAccount'>Log Out</button>
		</div>`);
}

function deleteEntryWarning(id){
	$('#deleteEntryWarning').show().append(`Are you sure you want to delete this entry?
		<button type='button' class='deleteEntryConfirm' value=${id}>YES</button>
		<button type='button' class='dontDeleteButton'>NO</button>`);
}

function createEditForm(objectInfo){
	let keywordsArray = objectInfo.keywords.split(', ');
	$('#editEntryWindow').show().attr("value", objectInfo.id).html(`<div class='dreamlogEntryButtons'>
			<button type="button" class='exitEditEntryButton'>Exit Edit</button>			
			</div>
			<form class="editEntryForm">
			    <h3>${objectInfo.date}</h3>
      			<fieldset class="editEntryFieldset">
      			<h4>Keywords:</h4>
				<input type='text' name='dreamKeywordsInput1' value='${keywordsArray[0]}' aria-label="dream-keyword-input" required>
        		<input type='text' name='dreamKeywordsInput2' value='${keywordsArray[1]}' aria-label="dream-keyword-input">
        		<input type='text' name='dreamKeywordsInput3' value='${keywordsArray[2]}' aria-label="dream-keyword-input">
				<h4>Mood:</h4>
        		<input type='text' name='dreamMoodInput' value='${objectInfo.mood}' aria-label="dream-keyword-input">

				<h4>Dream Entry:</h4>
				<legend class='dreamEntryLegend'>
        		<textarea type='text' name='dreamContentInput' value='${objectInfo.content}' aria-label="dream-entry-content-input" required>
        		</textarea></legend>
        		</fieldset>
      			<button role="button" type="submit" class="editFormSubmitButton" hidden>Submit</button>
    		</form>`
        	);
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

function findMostCommonEvents(data){
	let allEvents = [];
	let uniqueEvents = [];
	let countedEvents = [];
	data.forEach(object => {
		object.lifeEvents.forEach(item => {
			allEvents.push(item);
		});
	});
	uniqueEvents = [...new Set(allEvents)];
	uniqueEvents.forEach(item => {
		countedEvents.push({lifeEvents: item, count: 0});
	});
	allEvents.forEach(item => {
		countedEvents.forEach(object => {
			if(item === object.lifeEvents){
				object.count += 1;
			}
		});
	});

	let finalArray = countedEvents.sort(highestCount).map(object => {
		return object.lifeEvents;
	})

return finalArray;
}

function displaySymbolDetails(data, symbol, index){
	let dataWithSymbol = [];
	data.forEach(object=> {
		object.keywords.forEach(item=>{
			if(item === symbol){
				dataWithSymbol.push(object);
			}
		});
	});
	let moodArray = findMostCommonMood(dataWithSymbol);
	let lifeEventsArray = findMostCommonEvents(dataWithSymbol);
	let moodArrayString = moodArray[0];
	let eventsArrayString = lifeEventsArray[0];
	if(moodArray.length > 0){
		moodArrayString = moodArray.join(", ");
	}
	if(lifeEventsArray.length > 0){
		eventsArrayString = lifeEventsArray.join(", ");
	}
	$('.symbolsMoreInfoBox').empty().addClass('moreInfoCSS').append(
		`<h4>Most likely dreamt of ${symbol} when feeling: ${moodArrayString}</h4>
		<h4>Most likely dreamt of ${symbol} when dealing with: ${eventsArrayString}</h4>`
	);
	let eventsReference = updateCalendar(symbol, dataWithSymbol);
	$('#calendar').fullCalendar('addEventSource', eventsReference);
	$('html, body').animate({ 
   		scrollTop: $(document).height()-$(window).height()}, 
   		250, 
   		"linear"
	);
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
	$('#calendar').fullCalendar({
  		/*events: [
    		{
      		title: 'Event1',
      		start: '2018-05-05',
      		allDay: true,
      		rendering: 'background'
    		},
    		{
      		title: 'Event2',
      		start: '2018-05-07',
      		allDay: true,
      		rendering: 'background'
    		}
    		// etc...
  		],
/*
		eventClick: function(event) {
			console.log('cal event!');
    	}*/
	
  });
$('#calendar').on('click', function(event){
console.log($(this));
});
	console.log(data);
	let keywords = findMostCommonKeywords(data);
	let numKeywords = keywords.length;
	$('#dreamReport').append(`<div class='dreamSummary'>
		<h1>Last 30 Days:</h1>
		<p>Most common dream symbols:</p>
		</div><div class='dreamSymbols'></div>`);
			$('#dreamReport').append();
	if(numKeywords > 5){
		for(let i =0; i < 5; i++){
			$('#dreamReport').find('.dreamSymbols').append(
				`<div class='symbolBox'>
				<button type='button' role='button' class='extraSymbolInfo ${i}'>${keywords[i].keyword}</button></div>`);
		}
	}
	else {
		for(let i =0; i < numKeywords; i++){
			$('#dreamReport').find('.dreamSymbols').append(
				`<div class='symbolBox'>
				<button type='button' role='button' class='extraSymbolInfo ${i}'>${keywords[i].keyword}</button></div>`);
		}
	}
}

function displayDreamLogFILTER(data){
	console.log(data, 'in display dream log filter function');
	$('#dreamLog').empty();
	$('input[name="dreamSearchMoodInput"]').val('');
	$('input[name="dreamSearchKeywordInput"]').val('');
	if(data.length === 0){
		$('#dreamLog').append(`<div class='dreamEntry'>No results for this search</div>`);
	}
	else{
	data.forEach(object =>{
		let keywordsString = object.keywords.join(", ");
		$('#dreamLog').append(`<div class='dreamEntry' value=${object._id}>
		<div class='dreamlogEntryButtons'>
			<button type="button" class='editEntryButton'>Edit</button>
			<button type="button" class='deleteEntryButton'>Delete</button>
		</div>
		<h3 class='dateHeader'>${object.submitDate}</h3>
		<h4 class='keywordsHeader'>Keywords:</h4>
		<p>${keywordsString}</p>
		<h4 class='moodHeader'>Mood:</h4>
		<p>${object.mood}</p>
		<h4 class='nightmareHeader'>Nightmare:</h4><p>${object.nightmare}</p>
		<h4 class='contentHeader'>Dream Entry:</h4>
		<p>${object.content}</p>
		</div>`);
	});
	}
	/*}
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
	}*/
}

function displayDreamLog(data){
	console.log(data, 'in display dream log function');
	if(data.length === 0){
		$('#dreamLog').append(`<div class='dreamEntry'>No results for this search</div>`);
	}
	else{
	data.reverse().forEach(object =>{
		let date = new Date(object.submitDate);
		let keywordsString = object.keywords.join(", ");
		$('#dreamLog').append(`<div class='dreamEntry' value=${object._id}>
		<div class='dreamlogEntryButtons'>
			<button type="button" class='editEntryButton'>Edit</button>
			<button type="button" class='deleteEntryButton'>Delete</button>
		</div>
		<h3 class='dateHeader'>${date.toString().substring(0,3)} ${date.toLocaleDateString()}</h3>
		<h4 class='keywordsHeader'>Keywords:</h4>
		<p>${keywordsString}</p>
		<h4 class='moodHeader'>Mood:</h4>
		<p>${object.mood}</p>
		<h4 class='nightmareHeader'>Nightmare:</h4><p>${object.nightmare}</p>
		<h4 class='lifeEventsHeader'>Themes of Importance or Worry at Time:</h4>
		<p>${object.lifeEvents}</p>
		<h4 class='contentHeader'>Dream Entry:</h4>
		<p>${object.content}</p>
		</div>`);
	});
	}
}

function getDreamData(){
	if(currentPATH === '/dreamlog.html'){
		$.ajax({
			method: 'GET',
			url: getEndpoint(),
			success: displayDreamLog,
			error: function(err){
				console.log(err);
			},
			dataType: 'json',
			beforeSend: setJWTHeader
		});
	}
}

function findSelectedID(selection){
	return selection.parents('.dreamEntry')[0].attributes[1].value;
}

function setJWTHeader(xhr) {
    xhr.setRequestHeader('Authorization', 'Bearer '+ localStorage.getItem('JWT_USER'));
    xhr.setRequestHeader('Content-Type', 'application/json');
}

function displayHomePage(){
	window.location.href = 'dreamreport.html';
}

function updateJWT(object){
	$.ajax({
		method: 'POST',
		url: `${currentPATH}login`,
		data: JSON.stringify(object), 
		success: function(data){
			localStorage.setItem('JWT_USER', data.authToken);
			displayHomePage();
		},
		error: function(err){
			console.log(err);
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}

function dreamReportPageListeners(){
	let dreams;
	if(currentPATH === '/dreamreport.html'){
		$.ajax({
			method: 'GET',
			url: getEndpoint(),
			success: function(data){
				dreams = data;
				displayDreamReport(data);
			},
			error: function(err){
				console.log(err);
			},
			dataType: 'json',
			beforeSend: setJWTHeader
		});
	}
	$('#dreamReport').on('click', '.symbolBox', function(){
		$('.symbolsMoreInfoBox').show();
		let index = $(this).find('button').attr('class').slice(-1);
		let targetSymbol = $(this).find('button').text();
		$('#calendar').fullCalendar('removeEvents');
		displaySymbolDetails(dreams, targetSymbol, index);
	});
}

function dreamLogPageListeners(){
	getDreamData();
	/*$('.searchDreamKeywordsForm').submit(event => {
		event.preventDefault();
		$('#dreamLog').empty();
		let keywordSearch = $('input[name="dreamSearchKeywordInput"]').val();
		console.log(keywordSearch);
		$.ajax({
			method: 'POST',
			url: `${API_ENDPOINT}/dream-log`,
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
	});*/
	$('.searchDreamForm').submit(event => {
		event.preventDefault();
		$('#dreamLog').empty();
		let searchObj = {};
		let moodSearch = $('input[name="dreamSearchMoodInput"]').val();
		let keywordSearch = $('input[name="dreamSearchKeywordInput"]').val();
		console.log(keywordSearch, moodSearch);
		if(moodSearch.length > 0 || moodSearch !== ''){
			moodSearch = moodSearch.charAt(0).toUpperCase() + moodSearch.slice(1);
			searchObj["searchMood"] = moodSearch;
		}
		if(keywordSearch !== '' || keywordSearch.length > 0){
			searchObj["searchKey"] = keywordSearch;
		}
		console.log(searchObj);
		$.ajax({
			method: 'POST',
			url: `${getEndpoint()}/dream-log`,
			data: JSON.stringify(searchObj), 
			success: function(data){
				displayDreamLogFILTER(data);
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
		let objId = findSelectedID($(event.currentTarget));
		let textObject = {
			id: objId,
			date: $(`div[value='${objId}']`).find('.dateHeader').text(),
			keywords: $(`div[value='${objId}']`).find('.keywordsHeader').next().text(),
			mood: $(`div[value='${objId}']`).find('.moodHeader').next().text(),
			content: $(`div[value='${objId}']`).find('.contentHeader').next().text()
		}
		createEditForm(textObject);
	});
	$('#editEntryWindow').on('click', '.editFormSubmitButton', event => {
		event.preventDefault();
		let id = $('#editEntryWindow').attr('value');
		let newDream = $('#editEntryWindow').find('textarea[name="dreamContentInput"]').val();
		let objDate = $('#editEntryWindow').find('h3').text();
		let keywords = [];
		keywords.push($('#editEntryWindow').find('input[name="dreamKeywordsInput1"]').val());
		keywords.push($('#editEntryWindow').find('input[name="dreamKeywordsInput2"]').val());
		keywords.push($('#editEntryWindow').find('input[name="dreamKeywordsInput3"]').val());
		let userMood = $('#editEntryWindow').find('input[name="dreamMoodInput"]').val();
		//must break out mood into array in case of mult selections
		let newObject = {
			'id': id,
			'submitDate': new Date(objDate),
			'keywords': keywords,
			'mood': [userMood], 
			'content': newDream
			};
		$.ajax({
			method: 'PUT',
			url: `${getEndpoint()}/${id}`,
			data: JSON.stringify(newObject), 
			success: function(){
				console.log('made it to success');
				$('#editEntryWindow').hide();
				location.reload();
			},
			error: function(err){
				console.log(err);
			},
			dataType: 'json',
			beforeSend: setJWTHeader
		});
	});
	$('#editEntryWindow').on('click', '.exitEditEntryButton', event => {
		event.preventDefault();
		$('#editEntryWindow').hide();
	})
	$('#dreamLog').on('click', '.deleteEntryButton', event =>{
		event.preventDefault();	
		deleteEntryWarning(findSelectedID($(event.currentTarget)));
	});
	$('#pageContents').on('click', '.deleteEntryConfirm', event =>{
		event.preventDefault();	
		let id = $('#deleteEntryWarning').find('.deleteEntryConfirm').val();
		$.ajax({
			method: 'DELETE',
			url: `${getEndpoint()}/${id}`,
			success: function(){
				console.log('made it to success');
				$('#deleteEntryWarning').empty().hide();
				location.reload();
			},
			error: function(err){
				console.log(err);
			},
			//dataType: 'json',
			beforeSend: setJWTHeader
		});
	});
	$('#pageContents').on('click', '.dontDeleteButton', event =>{
		event.preventDefault();	
		$('#deleteEntryWarning').empty().hide();
	});
}

function newEntryPageListeners(){
	$('.moreInfoButton1').on('click', event => {
		event.preventDefault();
		$('textarea[name="dreamContentInput"]').animate({height:'100px'});
		$('.moreInfoButton1').hide();
		$('.moreInfoButton2').show();
		$('.moreInfoForm1').toggle();
	});
	$('.moreInfoButton2').on('click', event => {
		event.preventDefault();
		$('.moreInfoButton2').hide();
		$('.moreInfoForm2').toggle();
		$('.submitButton').toggle();
		$('html, body').animate({ 
   			scrollTop: $(document).height()-$(window).height()}, 
   			300, 
   			"linear"
		);
	});
	$('.dreamEntryForm').submit(event => {
		event.preventDefault();
		let newDream = $('textarea[name="dreamContentInput"]').val();
		let keywords = [];
		keywords.push($('input[name="dreamKeywordsInput1"]').val());
		keywords.push($('input[name="dreamKeywordsInput2"]').val());
		keywords.push($('input[name="dreamKeywordsInput3"]').val());
		let userMood = $('select[name="userMoodInput"]').val();
		let nightmare = $('input[type="radio"]:checked').val();
		let newDate = new Date();
		let userLifeThemes = $('select[name="userLifeEventsInput"]').val();
		//must break out mood into array in case of mult selections
		let newObject = {
			'submitDate': newDate,
			'keywords': keywords,
			'mood': userMood,
			'nightmare': nightmare,
			'lifeEvents': userLifeThemes,
			'content': newDream
			};
		$.ajax({
			method: 'POST',
			url: getEndpoint(),
			data: JSON.stringify(newObject), 
			success: function(data){
				history.pushState(null, null, '/dreamlog.html');
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
		if($('#accountProfileWindow').is(':visible')){
			$('#accountProfileWindow').hide().empty();
		}
		else{
		let current = window.location.href.split("/");
		let refreshPath = current.pop();
		$.ajax({
			method: 'GET',
			url: `${current.join('/')}/account`,
			//data: JSON.stringify(newObject), 
			success: displayAccountProfile,
			error: function(err){
				console.log(err);
			},
			dataType: 'json',
			beforeSend: setJWTHeader
		});
		}
	});
	$('#accountProfileWindow').on('click', '.closeProfileWindow', event => {
		event.preventDefault();
		$('#accountProfileWindow').hide().empty();
		/*let newPath = window.location.pathname.split('/')[1];
		console.log(newPath);
		history.pushState(null, null, `/${newPath}`);
		currentURL = window.location.href;*/
	});
	$('#accountProfileWindow').on('click', '.logOutOfAccount', event => {
		event.preventDefault();
		localStorage.removeItem('JWT_USER');
		window.location.href = '/';
	});/*
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
	});*/
}

function homePageButtonListeners(){
	navigationButtonListeners();
	newEntryPageListeners();
	dreamLogPageListeners();
	dreamReportPageListeners();
	$('.loginLink').on('click', function(){
		$('.createAccountButton').removeClass('selected');
		$('.loginAccountButton').addClass('selected');
		$('.signUpForm').hide();
		$('.loginForm').toggle();
		history.pushState({id: 'login'}, 'Account Login', '/login');
		currentURL = window.location.href;
	});
	$('.signupLink').on('click', function(){
		$('.loginAccountButton').removeClass('selected');
		$('.createAccountButton').addClass('selected');
		$('.loginForm').hide();
		$('.signUpForm').toggle();
		history.pushState({id: 'sign-up'}, 'Create Account', '/signup');
		currentURL = window.location.href;
	});
	$('.createAccountButton').on('click', event => {
		$('.loginAccountButton').removeClass('selected');
		$('.createAccountButton').addClass('selected');
		$('.loginForm').hide();
		$('.signUpForm').toggle();
		history.pushState({id: 'sign-up'}, 'Create Account', '/signup');
		currentURL = window.location.href;
	});
	$('.loginAccountButton').on('click', event => {
		$('.createAccountButton').removeClass('selected');
		$('.loginAccountButton').addClass('selected');
		$('.signUpForm').hide();
		$('.loginForm').toggle();
		history.pushState({id: 'login'}, 'Account Login', '/login');
		currentURL = window.location.href;
	});
	$('.signUpForm').submit(event => {
		event.preventDefault();
		user_USERNAME = $('input[aria-label="sign-up-form-username-input"]').val();
		let password = $('input[aria-label="sign-up-form-password-input"]').val();
		let first_Name = $('input[aria-label="sign-up-form-first-name-input"]').val().toString();
		let last_Name = $('input[aria-label="sign-up-form-last-name-input"]').val().toString();
		$.ajax({
			method: 'POST',
			url: `${currentPATH}account`,
			data: JSON.stringify({username: user_USERNAME, password: password, firstName: first_Name, lastName: last_Name}), 
			success: function(data){
				updateJWT({username: user_USERNAME, password: password});
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
		let password = $('input[aria-label="login-form-password-input"]').val();
		updateJWT({username: user_USERNAME, password: password});
	});
}

$(homePageButtonListeners);