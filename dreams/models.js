'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dreamSchema = mongoose.Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  submitDate: {
    type: Date,
    required: true,
  },
  keywords: [{
    type: String
  }],
  mood: [{
    type: String
  }],
  nightmare: {
    type: String
  },
  lifeEvents: [{
    type: String
  }],
  content: {
    type: String,
    required: true
  }
});

dreamSchema.methods.serialize = function() {
	return this;
}

const dreamEntry = mongoose.model('dreamEntry', dreamSchema);

module.exports = {dreamEntry};