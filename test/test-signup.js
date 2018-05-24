'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users');
const { TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;
chai.use(chaiHttp);

describe('New Account Functions', function () {
  const username = 'exampleUser';
  const password = 'examplePass';
  const firstName = 'examplefirstName';
  const lastName = 'examplelastName';
  const username2 = 'exampleUser2';
  const password2 = 'examplePass2';
  const firstName2 = 'examplefirstName2';
  const lastName2 = 'examplelastName2';

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () { 
  });

  afterEach(function () {
    return User.find({$or: [{username: 'exampleUser'}, {username: 'exampleUser2'}]}).remove();
  });

  describe('Create Account', function () {
    describe('POST', function () {
      it('Should reject users with missing username', function () {
        return chai
          .request(app)
          .post('/account')
          .send({
            password,
            firstName,
            lastName
          })
          .then(function(res){
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
    });

    it('Should reject users with missing password', function () {
        return chai.request(app)
          .post('/account')
          .send({
            username,
            firstName,
            lastName
          })
          .then(function(res){
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('password');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with non-string username', function () {
        return chai.request(app)
          .post('/account')
          .send({
            username: 1234,
            password,
            firstName,
            lastName
          })
          .then(function(res){
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('username');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            } 
          });
      });
      it('Should reject users with non-string password', function () {
        return chai.request(app)
          .post('/account')
          .send({
            username,
            password: 1234,
            firstName,
            lastName
          })
          .then(function(res){
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('password');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with non-string first name', function () {
        return chai.request(app)
          .post('/account')
          .send({
            username,
            password,
            firstName: 1234,
            lastName
          })
          .then(function(res){
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('firstName');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with non-string last name', function () {
        return chai.request(app)
          .post('/account')
          .send({
            username,
            password,
            firstName,
            lastName: 1234
          })
          .then(function(res){
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('lastName');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with non-trimmed username', function () {
        return chai.request(app)
          .post('/account')
          .send({
            username: ` ${username} `,
            password,
            firstName,
            lastName
          })
          .then(function(res){
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Cannot start or end with whitespace'
            );
            expect(res.body.location).to.equal('username');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with non-trimmed password', function () {
        return chai.request(app)
          .post('/account')
          .send({
            username,
            password: ` ${password} `,
            firstName,
            lastName
          })
          .then(function(res){
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Cannot start or end with whitespace'
            );
            expect(res.body.location).to.equal('password');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with empty username', function () {
        return chai.request(app)
          .post('/account')
          .send({
            username: '',
            password,
            firstName,
            lastName
          })
          .then(function(res){
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at least 1 characters long'
            );
            expect(res.body.location).to.equal('username');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with password less than 8 characters', function () {
        return chai.request(app)
          .post('/account')
          .send({
            username,
            password: '1234567',
            firstName,
            lastName
          })
          .then(function(res){
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at least 8 characters long'
            );
            expect(res.body.location).to.equal('password');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with password greater than 72 characters', function () {
        return chai.request(app)
          .post('/account')
          .send({
            username,
            password: new Array(73).fill('a').join(''),
            firstName,
            lastName
          })
          .then(function(res){
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at most 72 characters long'
            );
            expect(res.body.location).to.equal('password');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with duplicate username', function () {
        return User.create({
          username,
          password,
          firstName,
          lastName
        })
          .then(() =>
            chai.request(app).post('/account').send({
              username,
              password,
              firstName,
              lastName
            })
          )
          .then(function(res){
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Username already taken'
            );
            expect(res.body.location).to.equal('username');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should create a new user', function () {
        return chai.request(app)
          .post('/account')
          .send({
            username,
            password,
            firstName,
            lastName
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'username',
              'firstName',
              'lastName',
              'id',
              'accountCreated'
            );
            expect(res.body.username).to.equal(username);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.firstName).to.equal(firstName);
            expect(user.lastName).to.equal(lastName);
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      });
      it('Should trim firstName and lastName', function () {
        return chai.request(app)
          .post('/account')
          .send({
            username,
            password,
            firstName: ` ${firstName} `,
            lastName: ` ${lastName} `
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'username',
              'firstName',
              'lastName',
              'id',
              'accountCreated'
            );
            expect(res.body.username).to.equal(username);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.firstName).to.equal(firstName);
            expect(user.lastName).to.equal(lastName);
          });
      });
    });

    describe('GET', function () {
      it('Should return an empty array initially', function () {
        return chai.request(app).get('/account/users').then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(0);
        });
      });
      it('Should return an array of users', function () {
        return User.create(
          {
            username,
            password,
            firstName,
            lastName
          },
          {
            username: username2,
            password: password2,
            firstName: firstName2,
            lastName: lastName2
          }
        )
          .then(() => chai.request(app).get('/account/users'))
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(2);
            expect(res.body[0]).to.have.keys(
              'username',
              'firstName',
              'lastName',
              'id',
              'accountCreated'
            );
            expect(res.body[0].username).to.equal(username);
            expect(res.body[0].firstName).to.equal(firstName);
            expect(res.body[0].lastName).to.equal(lastName);
            expect(res.body[1]).to.have.keys(
              'username',
              'firstName',
              'lastName',
              'id',
              'accountCreated'
            );
            expect(res.body[1].username).to.equal(username2);
            expect(res.body[1].firstName).to.equal(firstName2);
            expect(res.body[1].lastName).to.equal(lastName2);
            });
          });
      });
    });