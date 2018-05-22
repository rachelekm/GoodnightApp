require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const config = require('../config');
const {app, runServer, closeServer, TEST_DATABASE_URL} = require('../server');


const expect = chai.expect;

chai.use(chaiHttp);

const AuthToken = function(user) {
  const subjectString = `${user.username}`;
  return jwt.sign({user}, config.JWT_SECRET, {
  subject: subjectString,
  expiresIn: '1d',
  algorithm: 'HS256'
  });
};

describe('Dream Journal', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  it('should get dreams on GET', function() {
    return chai.request(app)
      .get('/account/users')
      .then(function(res){
        return chai.request(app)
          .get('/dreams')
          .set('Authorization', `Bearer ${AuthToken(res.body)}`);
      })
      .then(function(res) {
        expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            const expectedKeys = ['user', 'submitDate', 'keywords', 'mood', 'nightmare', 'lifeEvents', 'content'];
            res.body.forEach(function(item) {
              expect(item).to.be.a('object');
              expect(item).to.include.keys(expectedKeys);
            });
          });
  });

  it('should add an a new dream entry on POST', function() {
    let newItem;
    return chai.request(app)
      .get('/account/users')
      .then(function(res){
        newItem = {"keywords": [ "cat", "fish", "dog" ],
          "mood": [ "lethargic" ], 
          "lifeEvents": [ "Sense of Purpose" ], 
          "submitDate": "2018-05-20T20:55:06.000Z", 
          "nightmare": "no", 
          "content": "new dream entry test"};

        return chai.request(app)
          .post('/dreams')
          .set('Authorization', `Bearer ${AuthToken(res.body[0])}`)
          .set('Content-Type', 'application/json')
          .send(newItem);
      })
      .then(function(res) {
        const expectedKeys = ['submitDate', 'keywords', 'mood', 'nightmare', 'lifeEvents', 'content'];
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys(expectedKeys);
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newItem, {_id: res.body._id}, {user: res.body.user}, {__v: 0}));
      });
  });
//finish editing below!
  it('should update items on PUT', function() {
    let user;
    return chai.request(app)
      .get('/account/users')
      .then(function(res){
        user = res.body[0];
        return chai.request(app)
          .get('/dreams')
          .set('Authorization', `Bearer ${AuthToken(user)}`);
      })
      .then(function(res) {
        const entryID = res.body[0]._id;
        updatedData = {"id": `${entryID}`,
          "keywords": [ "updatedKeyword", "fish", "dog" ],
          "mood": [ "calm" ], 
          "lifeEvents": [ "Sense of Purpose" ], 
          "submitDate": "2018-05-20T20:55:06.000Z", 
          "nightmare": "yes", 
          "content": "new dream entry test"};

        return chai.request(app)
          .put(`/dreams/${entryID}`)
          .set('Authorization', `Bearer ${AuthToken(user)}`)
          .set('Content-Type', 'application/json')
          .send(updatedData);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });

  it('should delete dream entry on DELETE', function() {
    let user;
    return chai.request(app)
    .get('/account/users')
    .then(function(res){
      user = res.body[0];
      return chai.request(app)
      .get('/dreams')
      .set('Authorization', `Bearer ${AuthToken(user)}`);
    })
    .then(function(res){
      const entryID = res.body[0]._id;
      return chai.request(app)
      .delete(`/dreams/${entryID}`)
      .set('Authorization', `Bearer ${AuthToken(user)}`);
    })
    .then(function(res){
      expect(res).to.have.status(204);
    })
  });
});