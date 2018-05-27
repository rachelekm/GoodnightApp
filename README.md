# Goodnight App
A diary application for better dream journaling: users create an account to enter dreams; view their previous entries; search by tags, life events, emotion; or use the interactive homepage calendar to discover relationships between their dream life and waking life. 

## Motivation
I keep a dream journal but found that I was having trouble using all my pages towards any action or reflection. My journal was disorganized and hard to parse through for any valuable pattern. I wanted a way to record my dreams and be able to see the relationships between what I was dreaming and what was happening in my waking life, and make those clues viewable in an easy, interactive calendar.

## Live Demo
Create an account on click the 'Try the Demo' link on the landing page


https://thegoodnightapp.herokuapp.com/

## Summary
A user can create a Goodnight App account and will be prompted to enter their first dream. An entry consists of the dream content as well as prompts for significant symbols that stuck out, if it was a nightmare, mood at the time, and what life events are currently happening around the user. Once dreams are submitted, they are stored in the user's private dream log, searchable by content, mood, or events. The homepage offers a summary of the user's most dreamt symbols in the last 30 days, what the user was most often feeling when those symbols were dreamt, and an interactive calendar to better connect dream content to what's going on in the user's daily life. 

## Screenshots
### Landing Page:
#### Desktop View:
![screenshot of desktop landing page](/screenshots/landingpagedesktop.png)
#### Mobile View:
![screenshot of desktop landing page](/screenshots/landingpagemobile.png)
### Homepage:
#### Desktop View:
![screenshot of desktop homepage](/screenshots/homepagedesktop.png)
#### Mobile View:
![screenshot of desktop homepage](/screenshots/homepageMobile.jpg)
### Enter a New Dream Page:
#### Mobile View:
![screenshot of mobile new dream page](/screenshots/newdreamMobile.jpg)
### Dream Log and Search Page:
#### Mobile View:
![screenshot of mobile new dream page](/screenshots/dreamlogMobile1.jpg)

## Features
* CRUD application (add new dream, read all dreams, update, delete)
* Enter a unique dream once per day
* Search dreams by keywords, moods, or content
* See most commonly dreamt symbols in the last 30 days and interact with homepage calendar

## Technology Used
* HTML
* CSS
* Javascript
* jQuery
* Node.js
* Express
* Mocha/Chai
* Passport.js
* MongoDB
* Mongoose

## Security
* User passwords are encrypted using bcrypt.js
