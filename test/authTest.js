let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

var token;


describe('/POST for login', () => {
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

    it('it should POST for login', (done) => {

        chai.request(server)
            .post('/api/auth/login')
            .send({
                "email": "manikanta.a@msitprogram.net",
                "password": "Avengersxmen1!"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res.body.should.have.property('token');
                res.body.should.have.property('valid');
                done();
            });
    });

  it('it should not POST for login', (done) => {

    chai.request(server)
      .post('/api/auth/login')
      .send({
        "email": "manikanta.a1@msitprogram.net",
        "password": "Avengersxmen1!"
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.a('object');
        res.body.should.have.property('error', 'wrong email');
        done();
      });
  });

  it('it should not POST for login', (done) => {

    chai.request(server)
      .post('/api/auth/login')
      .send({
        "email": "manikanta.a@msitprogram.net",
        "password": "Avengerxmen1!"
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.a('object');
        res.body.should.have.property('error', 'wrong password');
        done();
      });
  });

  after( done => done());
});
