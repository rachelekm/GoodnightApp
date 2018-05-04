'use strict';
let currentURL = window.location.href;;
let JWT_USER = '';

function displayData(data){
	$('#results').html(data);
}

function updateJWT(data){
	JWT_USER = data.authToken;
	console.log("different text!", JWT_USER);
	$('#results').html(`<p>${JWT_USER}</p>`);
} 

function homePageButtonListeners(){
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
			success: updateJWT(data),
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
				console.log("success!", data);
				displayData();
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