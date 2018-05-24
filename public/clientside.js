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

function randomColorGenerator(){
const colors = ["orange", "blue", "red", "green", "purple"];
	return colors[Math.floor(Math.random() * colors.length)];
}

function incorrectLoginWindow(){
	$('.loginFieldset').append(`<div class='warningBoxIncorrectLogin'>Your email or password are incorrect, please try again.</div>`)
}

function signUpErrorWindow(err){
	let newLocation;
	if(typeof err.location === 'object'){
		let message = err.message;
		err.location.forEach(err => {
			if(err === 'firstName'){ newLocation = 'first name'};
			if(err === 'lastName'){ newLocation = 'last name'};
			console.log(newLocation);
			$('.signUpFieldset').find(`input[placeholder="${newLocation}"]`).addClass('locationSelection');
		});
		$('.signUpFieldset').append(`<div class='warningBoxIncorrectLogin'>${message}</div>`);
	}
	else {
		if(err.location === 'firstName'){ newLocation = 'first name'};
		if(err.location === 'lastName'){ newLocation = 'last name'};
		$('.signUpFieldset').find(`input[placeholder="${newLocation}"]`).addClass('locationSelection');
		$('.signUpFieldset').append(`<div class='warningBoxIncorrectLogin'>${err.message}</div>`);
	}
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
	$('#deleteEntryWarning').show().append(`<span class='deleteText'>Are you sure you want to delete this entry?</span>
		<button type='button' class='deleteEntryConfirm' value=${id}>YES</button>
		<button type='button' class='dontDeleteButton'>NO</button>`);
}

function createEditForm(objectInfo){
	let date = makePrettyDate(objectInfo.submitDate);
	/*console.log(objectInfo);
	let keywordsArray = objectInfo.keywords;
	let keywordPlaceholderArray; 
	for(let i=0; i<keywordsArray.length; i++){
		if(keywordsArray[i] === 'undefined'){
			keywordPlaceholderArray.push(`${i+1}.`);
		}
		else{
			keywordPlaceholderArray.push(keywordsArray[i]);
		}
	}*/
	$('#editEntryWindow').show().attr("value", objectInfo._id).html(`<div class='dreamlogEditHeader'>
			<h3>${date}</h3>
			<button type="button" class='exitEditEntryButton'>Exit</button>			
			</div>
			<form class="editEntryForm">
      			<fieldset class="editEntryFieldset">
      			<legend class='dreamEntryLegendEDIT'>
        		<textarea type='text' name='dreamContentInput' aria-label="dream-entry-content-input" wrap='soft' required>${objectInfo.content}
        		</textarea></legend>
      			<h4>Keywords:</h4>
				<input type='text' name='dreamKeywordsInput1' value='${objectInfo.keywords[0]}' placeholder='${objectInfo.keywords[0]}' aria-label="dream-keyword-input" required>
        		<input type='text' name='dreamKeywordsInput2' value='${objectInfo.keywords[1]}' placeholder='${objectInfo.keywords[1]}' aria-label="dream-keyword-input">
        		<input type='text' name='dreamKeywordsInput3' value='${objectInfo.keywords[2]}' placeholder='${objectInfo.keywords[2]}' aria-label="dream-keyword-input">
				<legend class='moreInfoForm1EDIT'>Was this a nightmare?
            	<input type='radio' name='dreamTypeInput' value='yes' aria-label="dream-type-slection-option1"><label for='dreamTypeInput'>Yes</label>
            	<input type='radio' name='dreamTypeInput' value='no' aria-label="dream-type-slection-option2"><label for='dreamTypeInput'>No</label>
            	</legend>
				<legend class='moreInfoForm2EDIT'>Select how you feel below:
				<select name='userMoodInput' aria-label="user-mood-input" multiple size='3' required>
      				<option value='happy'>Happy</option>
      				<option value='calm'>Calm</option>
      				<option value='lethargic'>Lethargic</option>
      				<option value='emotional'>Emotional</option>
      				<option value='anxious'>Anxious</option>
      				<option value='irritated'>Irritated</option>
      				<option value='depressed'>Depressed</option>
      				<option value='excited'>Excited</option>
      				<option value='nervous'>Nervous</option>
      				<option value='apathetic'>Apathetic</option>
      			</select></legend>
            	<legend class='moreInfoForm2EDIT'>Select the life themes you're currently giving significant thought or worry:
					<select name='userLifeEventsInput' aria-label="user-life-events-input" multiple size='3' required>
              			<option value='Opportunities and Professional Development'>Opportunities and Professional Development</option>
              			<option value='Sense of Purpose'>Sense of Purpose</option>
              			<option value='Home and Domestic Development'>Home and Domestic Development</option>
              			<option value='Family'>Family</option>
              			<option value='Relationships'>Relationships</option>
              			<option value='School or Work Expectations'>School or Work Expectations</option>
              			<option value='Creative Pursuits'>Creative Pursuits</option>
              			<option value='Security and Control'>Security and Control</option>
              			<option value='Religion or Spirituality'>Religion or Spirituality</option>
              			<option value='Health'>Health</option>
              			<option value='Money'>Money</option>
              			<option value='Aging'>Aging</option>
              			<option value='Physical Appearance'>Physical Appearance</option>
            		</select>
            		</legend>
        		</fieldset>
      			<button role="button" type="submit" class="editFormSubmitButton">Submit</button>
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
	if(data.length === 0){
	$('#dreamReport').append(`<div class='dreamSummary'>
		<h1>You haven't entered any dreams yet! Click<a href='newentry.html'> here </a>to record your first dream.</h1>
		<p>Once you record your dream, come back here to view your dream journey.</p>
		</div><div class='dreamSymbols'></div>`);
			//$('#dreamReport').append();	
	}
	else{
	let keywords = findMostCommonKeywords(data);
	let numKeywords = keywords.length;
	$('#dreamReport').append(`<div class='dreamSummary'>
		<h1>Last 30 Days:</h1>
		<p>Most common dream symbols:</p>
		</div><div class='dreamSymbols'></div>`);
			$('#dreamReport').append();
	if(numKeywords > 5){
		for(let i =0; i < 5; i++){
			if(keywords[i].keyword !== ''){
			let color = randomColorGenerator();
			$('#dreamReport').find('.dreamSymbols').append(
				`<div class='symbolBox ${color}'>
				<button type='button' role='button' class='extraSymbolInfo ${color} ${i}'>${keywords[i].keyword}</button></div>`);
			}
		}
	}
	else {
		for(let i =0; i < numKeywords; i++){
			if(keywords[i].keyword !== ''){
			let color = randomColorGenerator();
			$('#dreamReport').find('.dreamSymbols').append(
				`<div class='symbolBox ${color}'>
				<button type='button' role='button' class='extraSymbolInfo ${color} ${i}'>${keywords[i].keyword}</button></div>`);
			}
		}
	}
	}
}

function displayDreamLogFILTER(data){
	console.log(data, 'in display dream log filter function');
	$('.searchDreamForm').find('.viewAllDreamEntries').remove();
	$('.searchDreamForm').find('.searchTextBoxLog').remove();
	$('#dreamLog').empty();
	let searchQuery = data.query;
	$('input[name="dreamSearchInput"]').val('');
	$('.searchDreamForm').append(`<button type='button' role='button' class='viewAllDreamEntries'>View All</button>`);
	$('.searchDreamForm').append(`<div class='searchTextBoxLog'>Searched for: ${searchQuery}</button>`);
	if(data.entries.length === 0){
		$('#dreamLog').append(`<div class='dreamEntry'>No results for this search</div>`);
	}
	else{
	data.entries.reverse().forEach(object =>{
		let date = new Date(object.submitDate);
		$('#dreamLog').append(`<div class='dreamEntry' value=${object._id}>
		<div class='dreamlogEntryButtons'>
			<button type="button" class='editEntryButton'>Edit</button>
			<button type="button" class='deleteEntryButton'>Delete</button>
		</div>
		<h3 class='dateHeader'>${date.toString().substring(0,3)} ${date.toLocaleDateString()}</h3>
		<p class='dreamEntryContent'>${object.content}</p>
		<button type='button' role='button' class='seeMoreLogEntry${object._id}'><img class='seeMoreImage' src='https://i.imgur.com/lX9FEcH.png?1'/></button>
		<div class='moreDreamEntryBox${object._id}' hidden><div class='keywordsSection'><h4>Keywords:</h4><div class='tags'></div></div>
		<div class='moodSection'><h4>Mood:</h4><div class='tags'></div></div>
		<div class='nightmareSection'><h4>Nightmare:</h4><p>${object.nightmare}</p></div>
		<div class='lifeEventsSection'><h4>Themes of Importance or Worry at Time:</h4></div>
		</div>
		</div>`);
		let color;
		object.keywords.forEach(item => {
			color = randomColorGenerator();
			if(item.length > 0){
			$('#dreamLog').find(`.moreDreamEntryBox${object._id} .keywordsSection div`)
			.append(`<button type='button' role='button' class='tagButtons ${color}'>${item}</button>`);
			}
		});
		object.mood.forEach(item => {
			color = randomColorGenerator();
			if(item.length > 0){
			$('#dreamLog').find(`.moreDreamEntryBox${object._id} .moodSection div`)
			.append(`<button type='button' role='button' class='tagButtons ${color}'>${item}</button>`);
		}
		});
		object.lifeEvents.forEach(item => {
			color = randomColorGenerator();
			if(item.length > 0){
			$('#dreamLog').find(`.moreDreamEntryBox${object._id} .lifeEventsSection`)
			.append(`<button type='button' role='button' class='tagButtons ${color}'>${item}</button>`);
		}
		});
	});
	}
}

function displayDreamLog(data){
	console.log(data, 'in display dream log function');
	if(data.entries === 0){
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
		<p class='dreamEntryContent'>${object.content}</p>
		<button type='button' role='button' class='seeMoreLogEntry${object._id}'><img class='seeMoreImage' src='https://i.imgur.com/lX9FEcH.png?1'/></button>
		<div class='moreDreamEntryBox${object._id}' hidden><div class='keywordsSection'><h4>Keywords:</h4><div class='tags'></div></div>
		<div class='moodSection'><h4>Mood:</h4><div class='tags'></div></div>
		<div class='nightmareSection'><h4>Nightmare:</h4><p>${object.nightmare}</p></div>
		<div class='lifeEventsSection'><h4>Themes of Importance or Worry at Time:</h4></div>
		</div>
		</div>`);
		let color;
		object.keywords.forEach(item => {
			color = randomColorGenerator();
			if(item.length > 0){
			$('#dreamLog').find(`.moreDreamEntryBox${object._id} .keywordsSection div`)
			.append(`<button type='button' role='button' class='tagButtons ${color}'>${item}</button>`);
			}
		});
		object.mood.forEach(item => {
			color = randomColorGenerator();
			if(item.length === 'null'){
			$('#dreamLog').find(`.moreDreamEntryBox${object._id} .moodSection div`)
			.append(`<button type='button' role='button' class='tagButtons ${color}'>${item}</button>`);
		}
		});
		object.lifeEvents.forEach(item => {
			color = randomColorGenerator();
			if(item.length > 0){
			$('#dreamLog').find(`.moreDreamEntryBox${object._id} .lifeEventsSection`)
			.append(`<button type='button' role='button' class='tagButtons ${color}'>${item}</button>`);
		}
		});
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

function refreshJWT(){
	$.ajax({
		method: 'POST',
		url: `/login/refresh`,
		success: function(data){
			localStorage.setItem('JWT_USER', data.authToken);
			displayHomePage();
		},
		error: function(err){
			console.log(err);
		},
		dataType: 'json',
		contentType: 'application/json',
		beforeSend: setJWTHeader
	});
}

function updateJWT(object){
	$.ajax({
		method: 'POST',
		url: '/login',
		data: JSON.stringify(object), 
		success: function(data){
			localStorage.setItem('JWT_USER', data.authToken);
			displayHomePage();
		},
		error: function(err){
			if(err.status===401){
				incorrectLoginWindow();
			}
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
	$('.searchDreamForm').on('click', '.viewAllDreamEntries', event => {window.location.href = 'dreamlog.html';});
	$('#dreamLog').on('click', '.dreamEntry', event => {
		let selectedID = event.currentTarget.attributes[1].textContent;
		console.log(selectedID);
		$('#dreamLog').find(`.moreDreamEntryBox${selectedID}`).toggle('slow');
		$('#dreamLog').find(`.seeMoreLogEntry${selectedID}`).toggle();
	});
	$('.searchDreamForm').submit(event => {
		event.preventDefault();
		$('#dreamLog').empty();
		//let searchObj = {};
		let search = $('input[name="dreamSearchInput"]').val();
		/*if(moodSearch.length > 0 || moodSearch !== ''){
			moodSearch = moodSearch.charAt(0).toUpperCase() + moodSearch.slice(1);
			searchObj["searchMood"] = moodSearch;
		}
		if(keywordSearch !== '' || keywordSearch.length > 0){
			searchObj["searchKey"] = keywordSearch;
		}*/
		$.ajax({
			method: 'POST',
			url: `${getEndpoint()}/dream-log`,
			data: JSON.stringify({search: search}), 
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
	$('#dreamLog').on('click', '.tagButtons', event =>{
		$('#dreamLog').empty();
		let search = $(event.currentTarget).text();
		$.ajax({
			method: 'POST',
			url: `${getEndpoint()}/dream-log`,
			data: JSON.stringify({search: search}), 
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
		$.ajax({
			method: 'GET',
			url: `${getEndpoint()}/${objId}`,
			success: function(data){
				createEditForm(data);
			},
			error: function(err){
				console.log(err);
			},
			dataType: 'json',
			beforeSend: setJWTHeader
		});
		/*let textObject = {
			id: objId,
			date: $(`div[value='${objId}']`).find('.dateHeader').text(),
			keywords: $(`div[value='${objId}']`).find('.keywordsHeader').next().text(),
			mood: $(`div[value='${objId}']`).find('.moodHeader').next().text(),
			content: $(`div[value='${objId}']`).find('.dreamEntryContent').text()
		}
		createEditForm(textObject);*/
	});
	$('#editEntryWindow').on('click', '.editFormSubmitButton', event => {
		event.preventDefault();
		let id = $('#editEntryWindow').attr('value');
		let newDream = $('#editEntryWindow').find('textarea').val();
		let objDate = $('#editEntryWindow').find('h3').text();
		let keywords = [];
		keywords.push($('#editEntryWindow').find('input[name="dreamKeywordsInput1"]').val());
		keywords.push($('#editEntryWindow').find('input[name="dreamKeywordsInput2"]').val());
		keywords.push($('#editEntryWindow').find('input[name="dreamKeywordsInput3"]').val());
		let userMood = $('#editEntryWindow').find('select[name="userMoodInput"]').val();
		let nightmare = $('#editEntryWindow').find('input[type="radio"]:checked').val();
		let userLifeThemes = $('#editEntryWindow').find('select[name="userLifeEventsInput"]').val();
		let newObject = {
			'id': id,
			'submitDate': new Date(objDate),
			'keywords': keywords,
			'mood': userMood,
			'nightmare': nightmare,
			'lifeEvents': userLifeThemes,
			'content': newDream
			};
			console.log(newObject);
		$.ajax({
			method: 'PUT',
			url: `${getEndpoint()}/${id}`,
			data: JSON.stringify(newObject), 
			success: function(){
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
				refreshJWT();
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
	if(currentPATH == '/signup'){
		$('.loginAccountButton').removeClass('selected');
		$('.createAccountButton').addClass('selected');
		$('.loginForm').hide();
		$('.signUpForm').show();
	}
	$('.loginLink').on('click', function(){
		$('.createAccountButton').removeClass('selected');
		$('.loginAccountButton').addClass('selected');
		$('.signUpForm').hide();
		$('.loginForm').show();
		history.pushState({id: 'login'}, 'Account Login', '/login');
		currentURL = window.location.href;
	});
	$('.signupLink').on('click', function(){
		$('.loginAccountButton').removeClass('selected');
		$('.createAccountButton').addClass('selected');
		$('.loginForm').hide();
		$('.signUpForm').show();
		history.pushState({id: 'sign-up'}, 'Create Account', '/signup');
		currentURL = window.location.href;
	});
	$('.createAccountButton').on('click', event => {
		$('.loginAccountButton').removeClass('selected');
		$('.createAccountButton').addClass('selected');
		$('.loginForm').hide();
		$('.signUpForm').show();
		history.pushState({id: 'sign-up'}, 'Create Account', '/signup');
		currentURL = window.location.href;
	});
	$('.loginAccountButton').on('click', event => {
		$('.createAccountButton').removeClass('selected');
		$('.loginAccountButton').addClass('selected');
		$('.signUpForm').hide();
		$('.loginForm').show();
		history.pushState({id: 'login'}, 'Account Login', '/login');
		currentURL = window.location.href;
	});
	$('.signUpForm').submit(event => {
		event.preventDefault();
		$('.signUpFieldset').find(`input`).removeClass('locationSelection');
		$('.signUpFieldset').find('.warningBoxIncorrectLogin').remove();
		user_USERNAME = $('input[aria-label="sign-up-form-username-input"]').val();
		let password = $('input[aria-label="sign-up-form-password-input"]').val();
		let first_Name = $('input[aria-label="sign-up-form-first-name-input"]').val().toString();
		let last_Name = $('input[aria-label="sign-up-form-last-name-input"]').val().toString();
		$.ajax({
			method: 'POST',
			url: `/account`,
			data: JSON.stringify({username: user_USERNAME, password: password, firstName: first_Name, lastName: last_Name}), 
			success: function(data){
				updateJWT({username: user_USERNAME, password: password});
			},
			error: function(err){
				if(err.status===422){
					signUpErrorWindow(err.responseJSON);
				}
				console.log(err);
			},

			dataType: 'json',
			contentType: 'application/json'
		});
	});

	$('.loginForm').submit(event => {
		event.preventDefault();
		$('.loginFieldset').find('.warningBoxIncorrectLogin').remove();
		user_USERNAME = $('input[aria-label="login-form-username-input"]').val();
		let password = $('input[aria-label="login-form-password-input"]').val();
		updateJWT({username: user_USERNAME, password: password});
	});
}

function landingPageListeners(){
	homePageButtonListeners();
	navigationButtonListeners();
	newEntryPageListeners();
	dreamLogPageListeners();
	dreamReportPageListeners();
	$('.getStartedButton').on('click', event => {
		$('#homepage').show();
		$('#landingPage').hide();
		$('.loginAccountButton').removeClass('selected');
		$('.createAccountButton').addClass('selected');
		$('.signUpForm').show();
		$('.loginForm').hide();
		history.pushState({id: 'sign-up'}, 'Create Account', '/signup');
	});
	$('.getStartedLoginButton').on('click', event => {
		$('#homepage').show();
		$('#landingPage').hide();
		$('.createAccountButton').removeClass('selected');
		$('.loginAccountButton').addClass('selected');
		$('.loginForm').show();
		$('.signUpForm').hide();
		history.pushState({id: 'login'}, 'Account Login', '/login');
	});
	$('.demoAccountLoginButton').on('click', event => {
		event.preventDefault();
		user_USERNAME = 'Demo_Account';
		let password = 'Demo_Account_Password';
		updateJWT({username: user_USERNAME, password: password});
	});
}

$(landingPageListeners);
