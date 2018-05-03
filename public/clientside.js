'use strict';
const currentURL = window.location.href;

function displayData(data){
	$('.results').html(data);
}

function submitButtonListener(){
	$('.signUpForm').submit(event => {
		event.preventDefault();
		let username = $('input[type="text"]').val();
		let password = $('input[type="password"]').val();
		console.log(username, password, currentURL);
		$.ajax({
			method: 'POST',
			url: `${currentURL}signup`,
			data: JSON.stringify({username: username, password: password}), 
			success: function(data){
				console.log("success!" + data);
				displayData();
			},
			dataType: 'json',
			contentType: 'application/json'
		});
	});

	$('.loginForm').submit(event => {
		event.preventDefault();
		let username = $('input[type="text"]').val();
		let password = $('input[type="password"]').val();
		console.log(username, password);
	});
}

$(submitButtonListener);