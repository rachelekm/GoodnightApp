'use strict';
let currentURL = window.location.href;
let currentPATH = window.location.pathname;
let user_USERNAME = '';

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
	const symbols = ['keyword', '💭', '🔔', '⚡'];
	let index = symbols.indexOf(symbol);
	if(index !== 1 || index !== 2 || index !== 3){
		index = 0;
	}
	$("#calendar").fullCalendar('removeEvents', function(eventObject) {
			if(eventObject.id === index) {
				return true;
			}
			else{
				return false;
			}
	});
	let eventsArray = dataArray.map(object => {
		return {
			title: `${symbol}`,
			id: index,
			start: `${object.submitDate.slice(0, 10)}`,
			allDay: true,
			imageurl: 'https://i.imgur.com/BC4IfeR.png',
			description: `${object._id}`
		};
	});
	return eventsArray;
}

function shuffle(a, b)
{
   return Math.random() > 0.5 ? -1 : 1;
}

function randomColorGenerator(){
const colors = ["orange", "blue", "red", "green", "purple"];
	return colors[Math.floor(Math.random() * colors.length)];
}

function incorrectLoginWindow(){
	$('.loginFieldset').append(`<div class='warningBoxIncorrectLogin' aria-live='assertive'>Your email or password are incorrect, please try again.</div>`)
}

function signUpErrorWindow(err){
	let newLocation;
	if(typeof err.location === 'object'){
		let message = err.message;
		err.location.forEach(err => {
			if(err === 'firstName'){ newLocation = 'first name'};
			if(err === 'lastName'){ newLocation = 'last name'};
			$('.signUpFieldset').find(`input[placeholder="${newLocation}"]`).addClass('locationSelection');
		});
		$('.signUpFieldset').append(`<div class='warningBoxIncorrectLogin' aria-live='assertive'>${message}</div>`);
	}
	else {
		newLocation = err.location;
		if(err.location === 'firstName'){ newLocation = 'first name'};
		if(err.location === 'lastName'){ newLocation = 'last name'};
		$('.signUpFieldset').find(`input[placeholder="${newLocation}"]`).addClass('locationSelection');
		$('.signUpFieldset').append(`<div class='warningBoxIncorrectLogin' aria-live='assertive'>${err.message}</div>`);
	}
}

function showGeneralErrorWindow(err){
	if(err.responseJSON.message === 'A dream entry has already been submitted today'){
		$('#pageContents').append(`<div class='oneEntryPerDay' aria-live='assertive'><p>It looks like you've already entered a dream for today! If you would like to edit last night's dream, click <a href='dreamlog.html'>here.</a></p></div>`);
		$('html, body').animate({ 
   		scrollTop: $(document).height()-$(window).height()}, 
   		250, 
   		"linear"
		);
	}
	else {
	$('#errorWarningWindow').show();
	}
}

function showRefreshTokenWindow(err){
	$('#refreshCredWarningWindow').show();
}

function errorListeners(){
	$('.backtoHomepageButton').on('click', event => {
		window.location.href = '/';
	});
	$('.refreshCredButton').on('click', event => {
		window.location.href = '/login';
	});
}

function displayAccountProfile(data){
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
	$('#editEntryWindow').show().attr("value", objectInfo._id).html(`<div class='dreamlogEditHeader'>
			<h1>${date}</h1>
			<button type="button" class='exitEditEntryButton'>Exit</button>			
			</div>
			<form class="editEntryForm">
      			<fieldset class="editEntryFieldset">
      			<legend class='dreamEntryLegendEDIT'>
        		<textarea type='text' name='dreamContentInput' aria-label="dream-entry-content-input" wrap='soft' class='textareaEditIE' required>${objectInfo.content}
        		</textarea></legend>
      			<h4>Keywords:</h4>
				<input type='text' class='inputKeywordEditIE' name='dreamKeywordsInput1' value='${objectInfo.keywords[0]}' placeholder='${objectInfo.keywords[0]}' aria-label="dream-keyword-input" required>
        		<input type='text' class='inputKeywordEditIE' name='dreamKeywordsInput2' value='${objectInfo.keywords[1]}' placeholder='${objectInfo.keywords[1]}' aria-label="dream-keyword-input">
        		<input type='text' class='inputKeywordEditIE' name='dreamKeywordsInput3' value='${objectInfo.keywords[2]}' placeholder='${objectInfo.keywords[2]}' aria-label="dream-keyword-input">
				<legend class='moreInfoForm1EDIT'>Was this a nightmare?
				<fieldset>
					<legend>
            			<input type='radio' class='inputRadioEditIE' name='dreamTypeInput' value='yes' aria-label="dream-type-slection-option1" required><label for='dreamTypeInput'>Yes</label>
            			<input type='radio' class='inputRadioEditIE' name='dreamTypeInput' value='no' aria-label="dream-type-slection-option2"><label for='dreamTypeInput'>No</label>
            		</legend>
            	</fieldset>
            	</legend>
				<legend class='moreInfoForm2EDIT'>Select how you feel below:
				<select name='userMoodInput' class='inputSelectEditIE' aria-label="user-mood-input" multiple size='3' required>
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
					<select name='userLifeEventsInput' class='inputSelectEditIE' aria-label="user-life-events-input" multiple size='3' required>
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

function displaySymbolDetails(data, symbol, index, color){
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
		`<h3>Most likely dreamt of ${symbol}...</h3> 
		<h4>When feeling: ${moodArrayString}</h4>
		<h4>When thinking about: ${eventsArrayString}</h4>`
	);
	let eventsReference = updateCalendar(color, dataWithSymbol);
	$('#calendar').fullCalendar('addEventSource', eventsReference);
	$('html, body').animate({ 
   		scrollTop: $(document).height()-$(window).height()}, 
   		250, 
   		"linear"
	);
	$('.fc-title').addClass(color).addClass('transparentText');

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

function viewCalendarEvents(data, selection){
	const allMoods = ['Happy', 'Calm', 'Lethargic', 'Emotional', 'Anxious', 'Irritated', 'Depressed', 'Excited', 'Nervous', 'Apathetic'];
	const allLifeEvents = ['Opportunities and Professional Development', 'Sense of Purpose', 'Home and Domestic Development', 'Family', 'Relationships', 'School or Work Expectations', 'Creative Pursuits', 'Security and Control', 'Religion or Spirituality', 'Health', 'Money', 'Aging', 'Physical Appearance'];

	if(selection==='Moods 💭'){
		let eventsReference = updateCalendar('💭', data);
		$('#calendar').fullCalendar('addEventSource', eventsReference);
	}
	else if(selection==='Life Events 🔔'){
		let eventsReference = updateCalendar('🔔', data);
		$('#calendar').fullCalendar('addEventSource', eventsReference);
	}
	else if(selection==='Nightmares ⚡'){
		let dataArray = [];
		data.forEach(object=> {
			if(object.nightmare === 'yes'){
				dataArray.push(object);
			}
		});
		let eventsReference = updateCalendar('⚡', dataArray);
		$('#calendar').fullCalendar('addEventSource', eventsReference);
	}
}

function displayCalEventDetails(data, calEvent){
	$('.symbolsMoreInfoBox').empty().hide();
	$('.eventsMoreInfoBox').empty().show();
	let dreamEntry;
	data.forEach(object=>{
		if(object._id == calEvent.description){
			dreamEntry = object;
		}
	});
	let keywordsString = dreamEntry.keywords.join(", ");
	let moodString = dreamEntry.mood.join(", ");
	let eventsString = dreamEntry.lifeEvents.join(", ");
	$('.eventsMoreInfoBox').append(`<h1>${makePrettyDate(dreamEntry.submitDate)}</h1><p>Keywords: ${keywordsString}</br>Mood: ${moodString}</br>Life Events: ${eventsString}</br>Nightmare: ${dreamEntry.nightmare}</p></br><button type='button' role='button' class='seeDreamByID' value='${dreamEntry._id}'>Read Dream</button>`);
    $('html, body').animate({ 
   		scrollTop: $(document).height()-$(window).height()}, 
   		300, 
   		"linear"
	);
}

function displayDreamReport(data){

	$('#calendar').fullCalendar({
		eventClick: function(calEvent, jsEvent, view) {
			if(calEvent.title === '💭' ||calEvent.title === '⚡'  || calEvent.title === '🔔' ){
				displayCalEventDetails(data, calEvent);
			}
  	}});
	$('#dreamReport').on('change', 'select', function(){
		event.preventDefault();
		let selection = $('#dreamReport').find('select :selected').text();
		viewCalendarEvents(data, selection);
	});
	if(data.length === 0){
	$('#dreamReport').append(`<div class='dreamSummary' aria-live='assertive'>
		<h1>You haven't entered any dreams yet! Click<a href='newentry.html'> here </a>to record your first dream.</h1>
		<p>Once you record your dream, come back here to view your dream journey.</p>
		</div><div class='dreamSymbols'></div>`);
	}
	else{
  		viewCalendarEvents(data, 'Nightmares ⚡');
		let keywords = findMostCommonKeywords(data);
		let numKeywords = keywords.length;
		let colors = ["orange", "blue", "red", "green", "purple"];
		$('#dreamReport').append(`<div class='dreamSummary'>
			<h1>Most common dream symbols:</h1>
			<p>Last 30 days:</p>
			</div><div class='dreamSymbols'></div>
			<div class='calendarSelection'><label>Viewing on calendar:
			<select>
				<option value="0">Nightmares ⚡</option>
				<option value="1">Moods 💭</option>
				<option value="2">Life Events 🔔</option>
			</select></label></div>`);
		colors = colors.sort(shuffle);
		if(numKeywords > 5){
			for(let i =0; i < 5; i++){
				if(keywords[i].keyword !== ''){
				let color = colors[i];
				$('#dreamReport').find('.dreamSymbols').append(
				`<div class='symbolBox ${color}'>
				<button type='button' role='button' class='extraSymbolInfo ${color} ${i}'>${keywords[i].keyword}</button></div>`);
				}	
			}
		}
		else {
			for(let i =0; i < numKeywords; i++){
				if(keywords[i].keyword !== ''){
				let color = colors[i];
				$('#dreamReport').find('.dreamSymbols').append(
				`<div class='symbolBox ${color}'>
				<button type='button' role='button' class='extraSymbolInfo ${color} ${i}'>${keywords[i].keyword}</button></div>`);
				}
			}
		}
	}
}

function displayDreamLogFILTER(data){
	$('.searchDreamForm').find('.viewAllDreamEntries').remove();
	$('.searchDreamForm').find('.searchTextBoxLog').remove().hide();
	$('#dreamLog').empty().addClass('dreamLogFilteredView');
	let searchQuery = data.query;
	$('input[name="dreamSearchInput"]').val('');
	if(data.entries.length === 0){
		$('#dreamLog').append(`<div class='dreamEntryNone' aria-live='assertive'><h1>You haven't entered any dreams yet! Click <a href='newentry.html'>here</a> to record your first dream.</h1>
		<p>Once you record your dream, come back here to view and search your dream bank.</p>
		</div>`);
	}
	else{
		if(searchQuery !== "" || searchQuery !== " "){
			$('.searchDreamForm').append(`<div class='searchTextBoxLog' aria-live='assertive'>Showing dreams with: ${searchQuery}</button>`);
		}
	data.entries.reverse().forEach(object =>{
		let date = new Date(object.submitDate);
		$('#dreamLog').append(`<div class='dreamEntry' value=${object._id}>
		<div class='dreamlogEntryButtons'>
			<button type="button" class='editEntryButton'>Edit</button>
			<button type="button" class='deleteEntryButton'>Delete</button>
		</div>
		<h1 class='dateHeader'>${date.toString().substring(0,3)} ${date.toLocaleDateString()}</h1>
		<p class='dreamEntryContent'>${object.content}</p>
		<button type='button' role='button' class='seeMoreLogEntry${object._id}'><img class='seeMoreImage' src='https://i.imgur.com/lX9FEcH.png?1' alt='expand view icon'/></button>
		<div class='moreDreamEntryBox${object._id}' hidden><div class='keywordsSection'><h2>Keywords:</h2><div class='tags'></div></div>
		<div class='moodSection'><h2>Mood:</h2><div class='tags'></div></div>
		<div class='nightmareSection'><h2>Nightmare:</h2><p>${object.nightmare}</p></div>
		<div class='lifeEventsSection'><h2>Themes of Importance or Worry at Time:</h2></div>
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
	$('#dreamLog').empty().removeClass('dreamLogFilteredView');
	if(!data.length > 0){
		$('#dreamLog').append(`<div class='dreamEntryNone' aria-live='assertive'><h1>You haven't entered any dreams yet! Click <a href='newentry.html'>here</a> to record your first dream.</h1>
		<p>Once you record your dream, come back here to view and search your dream bank.</p>
		</div>`);
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
		<h1 class='dateHeader'>${date.toString().substring(0,3)} ${date.toLocaleDateString()}</h1>
		<p class='dreamEntryContent'>${object.content}</p>
		<button type='button' role='button' class='seeMoreLogEntry${object._id}'><img class='seeMoreImage' src='https://i.imgur.com/lX9FEcH.png?1' alt='expand view icon'/></button>
		<div class='moreDreamEntryBox${object._id}' hidden><div class='keywordsSection'><h2>Keywords:</h2><div class='tags'></div></div>
		<div class='moodSection'><h2>Mood:</h2><div class='tags'></div></div>
		<div class='nightmareSection'><h2>Nightmare:</h2><p>${object.nightmare}</p></div>
		<div class='lifeEventsSection'><h2>Themes of Importance or Worry at Time:</h2></div>
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

function getDreamData(){
	if(currentPATH === '/dreamlog.html'){
		$.ajax({
			method: 'GET',
			url: getEndpoint(),
			success: displayDreamLog,
			error: function(err){
				if(err.status===401){
					showRefreshTokenWindow(err);
				}
				else{
					showGeneralErrorWindow(err);
				}
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
			if(err.status===401){
				showRefreshTokenWindow(err);
			}
			else{
				showGeneralErrorWindow(err);
			}
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
			else{
				showGeneralErrorWindow(err);
			}
			console.log(err);
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}

function displayDreamWindow(data){
	$('.dreamContentWindow').show().append(`<div class='dreamWindowHeader'><button role='button' type='button' class='exitDreamWindow'>EXIT</button></div><div class='contentsection'>${data.content}</div>`);
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
				if(err.status===401){
					showRefreshTokenWindow(err);
				}
				else{
					showGeneralErrorWindow(err);
				}
				console.log(err);
			},
			dataType: 'json',
			beforeSend: setJWTHeader
		});
	}
	$('#dreamReport').on('click', '.symbolBox', function(){
		$('.eventsMoreInfoBox').empty().hide();
		$('.symbolsMoreInfoBox').show();
		let color = $(this).find('button').attr('class').split(' ')[1];
		let index = $(this).find('button').attr('class').slice(-1);
		let targetSymbol = $(this).find('button').text();
		displaySymbolDetails(dreams, targetSymbol, index, color);
	});
	 $('.eventsMoreInfoBox').on('click', '.seeDreamByID', function(event){
  		let objID = $(this).val();
  		$.ajax({
			method: 'GET',
			url: `dreams/${objID}`,
			success: function(data){
				displayDreamWindow(data);
			},
			error: function(err){
				if(err.status===401){
					showRefreshTokenWindow(err);
				}
				else{
					showGeneralErrorWindow(err);
				}	
				console.log(err);
			},
			dataType: 'json',
			beforeSend: setJWTHeader
		});
	});
	 $('.dreamContentWindow').on('click', '.exitDreamWindow', function(event){
	 	$('.dreamContentWindow').empty().hide();
	 });
}

function dreamLogPageListeners(){
	getDreamData();
	$('.searchDreamForm').on('click', '.viewAllDreamEntries', event => {window.location.href = 'dreamlog.html';});
	$('#dreamLog').on('click', '.dreamEntry', event => {
		let selectedID = event.currentTarget.attributes[1].textContent;
		$('#dreamLog').find(`.moreDreamEntryBox${selectedID}`).toggle('slow');
		$('#dreamLog').find(`.seeMoreLogEntry${selectedID}`).toggle();
	});
	$('.searchDreamForm').submit(event => {
		event.preventDefault();
		$('#dreamLog').empty();
		let search = $('input[name="dreamSearchInput"]').val();
		$.ajax({
			method: 'POST',
			url: `${getEndpoint()}/dream-log`,
			data: JSON.stringify({search: search}), 
			success: function(data){
				displayDreamLogFILTER(data);
			},
			error: function(err){
				if(err.status===401){
					showRefreshTokenWindow(err);
				}
				else{
					showGeneralErrorWindow(err);
				}
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
				if(err.status===401){
					showRefreshTokenWindow(err);
				}
				else{
					showGeneralErrorWindow(err);
				}
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
				if(err.status===401){
					showRefreshTokenWindow(err);
				}
				else{
					showGeneralErrorWindow(err);
				}	
				console.log(err);
			},
			dataType: 'json',
			beforeSend: setJWTHeader
		});
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
		$.ajax({
			method: 'PUT',
			url: `${getEndpoint()}/${id}`,
			data: JSON.stringify(newObject), 
			success: function(){
				$('#editEntryWindow').hide();
				location.reload();
			},
			error: function(err){
				if(err.status===401){
					showRefreshTokenWindow(err);
				}
				else{
					showGeneralErrorWindow(err);
				}
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
				$('#deleteEntryWarning').empty().hide();
				location.reload();
			},
			error: function(err){
				if(err.status===401){
					showRefreshTokenWindow(err);
				}
				else{
					showGeneralErrorWindow(err);
				}
				console.log(err);
			},
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
		newDate = newDate.setHours(0,0,0,0);
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
				if(err.status===401){
					showRefreshTokenWindow(err);
				}
				else{
					showGeneralErrorWindow(err);
				}
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
				if(err.status===401){
					showRefreshTokenWindow(err);
				}
				else{
					showGeneralErrorWindow(err);
				}
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
	});
	$('#accountProfileWindow').on('click', '.logOutOfAccount', event => {
		event.preventDefault();
		localStorage.removeItem('JWT_USER');
		window.location.href = '/';
	});
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
				else{
					showGeneralErrorWindow(err);
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
	errorListeners();
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
