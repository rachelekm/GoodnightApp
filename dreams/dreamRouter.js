'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const path = require("path");
const passport = require('passport');

const { router: authRouter, localStrategy, jwtStrategy } = require('../auth');
passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', { session: false });

const {dreamEntry} = require('./models');

router.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname, '..', '/public/accounthomepage.html'));
  return res.status(200);
});

router.get('/dream-log', (req, res)=>{
  return res.status(200).sendFile(path.join(__dirname, '..', '/public/dreamlog.html'));
});

router.get('/dream-report', (req, res)=>{
  return res.status(200).sendFile(path.join(__dirname, '..', '/public/dreamreport.html'));
});

router.post('/', jsonParser, jwtAuth, (req, res) => {
	const requiredFields = ['submitDate', 'keywords', 'mood', 'content'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    	return res.status(422).json({
      	code: 422,
      	reason: 'ValidationError',
      	message: 'Missing field',
      	location: missingField
    	});
  }
  //trim whitespace from keyword input strings

  return dreamEntry.create({

    user: req.user.id,
    submitDate: req.body.submitDate,
    keywords: req.body.keywords,
    mood: req.body.mood,
    content: req.body.content

  }).then(dream => {
    return res.status(201).json(dream.serialize());
    })
    .catch(err => {
      console.log(err);
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

router.get('/dream-log-all', (req, res)=>{

  return dreamEntry.find().then(dreams => {
      return res.status(200).json(dreams.map(entry=>entry.serialize()));//.map(entry => {entry.serialize();}));
    })
    .catch(err => {
      console.log(err);
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

router.post('/dream-log', jsonParser, jwtAuth, (req, res) => {

  if(Object.keys(req.body) == 'searchKey'){
  return dreamEntry.find({"keywords": req.body.searchKey}).then(function(entries){
    return res.status(200).json(entries);
  })
  .catch(err => {
    console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
  });
  }
  if(Object.keys(req.body) == 'searchMood'){
    return dreamEntry.find({"mood": req.body.searchMood}).then(function(entries){
      return res.status(200).json(entries);
    })
    .catch(err => {
      console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    });
  }

  if(req.body.searchMood == '' || req.body.searchKey == ' ' || req.body.searchMood == ' ' || req.body.searchKey == ''){
    return dreamEntry.find().then(dreams => {
      return res.status(200).json(dreams.map(entry=>entry.serialize()));//.map(entry => {entry.serialize();}));
    })
    .catch(err => {
      console.log(err);
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
  }
});

router.get('/dream-report-all', (req, res)=>{

  return dreamEntry.find().then(dreams => {
      return res.status(200).json(dreams.map(entry=>entry.serialize()));//.map(entry => {entry.serialize();}));
    })
    .catch(err => {
      console.log(err);
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

module.exports = {router};
