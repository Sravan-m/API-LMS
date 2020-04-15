let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

var token;
chai.use(chaiHttp);

describe('/GET home content', () => {

  before(async function () {
    const res = await chai.request(server)
      .post('/api/auth/login')
      .send({
        "email": "manikanta.a@msitprogram.net",
        "password": "Avengersxmen1!"
      });
    token = res.body.token;
  });

    it('it should GET program home content', (done) => {

        chai.request(server)
            .get('/home?token='+token)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('courses');
                done();
            });
    });

    it('it should not GET program home content', (done) => {

        chai.request(server)
            .get('/home?token=invalid')
            .end((err, res) => {
                    res.should.have.status(401);
                done();
            });
    });

  after( done => done());
});

describe('/GET activity', () => {
  before(async function () {
    const res = await chai.request(server)
      .post('/api/auth/login')
      .send({
        "email": "manikanta.a@msitprogram.net",
        "password": "Avengersxmen1!"
      });
    console.log(token);
    token = res.body.token;
  });

    it('it should GET activity', (done) => {

        chai.request(server)
            .get('/api/activities/1')
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                done();
            });
    });

  after( done => done());
});

describe('/GET lesson', () => {

  before(async function () {
    const res = await chai.request(server)
      .post('/api/auth/login')
      .send({
        "email": "manikanta.a@msitprogram.net",
        "password": "Avengersxmen1!"
      });
    console.log(token);
    token = res.body.token;
  });

    it('it should GET lesson', (done) => {

        chai.request(server)
            .get('/api/lessons/2')
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                done();
            });
    });

  after( done => done());

});


