let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
const expect=chai.expect;


chai.use(chaiHttp);

var token = 'test';

describe('/GET user by valid id', () => {
  before(async function () {
    const res = await chai.request(server)
      .post('/api/auth/login')
      .send({
        "email": "manikanta.a@msitprogram.net",
        "password": "Avengersxmen1!"
      });
    // console.log(token);
    token = res.body.token;
  });

    it('it should GET specific user', (done) => {

        chai.request(server)
            .get('/api/user/details?id=5c89fb5a65dac41c6008ac5e&token='+token)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('firstName');
                    res.body.should.have.property('lastName');
                done();
            });
    });

    it('it should not GET specific user', (done) => {

        chai.request(server)
            .get('/api/user/details?id=5c89fb5a65dac41c6008ac5f&token='+token)
            .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('error', "Not Found");
                done();
            });
    });

    it('it should not GET specific user', (done) => {

        chai.request(server)
            .get('/api/user/details?id=5c89fb0d65dac4&token='+token)
            .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('error', "Invalid Object ID");
                done();
            });
    });

  it('it should not GET specific user', (done) => {

    chai.request(server)
      .get('/api/user/details?id=5c89fb0d65dac4&token=invalid')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('error', "Invalid Token");
        done();
      });
  });

  it('it should not GET specific user', (done) => {

    chai.request(server)
      .get('/api/user/details?id=5c89fb0d65dac4&token='+token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error', "Invalid Object ID");
        done();
      });
  });

  after( done => done());
});

describe('/GET user role', () => {
  before(async function () {
    const res = await chai.request(server)
      .post('/api/auth/login')
      .send({
        "email": "manikanta.a@msitprogram.net",
        "password": "Avengersxmen1!"
      });
    // console.log(token);
    token = res.body.token;
  });
  it('it should GET user\'s role', (done) => {
    chai.request(server)
      .get('/api/user/role?token='+token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('role');
        done();
      });

  });

  it('it should GET user\'s role', (done) => {
    chai.request(server)
      .get('/api/user/role?token=invalid')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('error', "Invalid Token");
        done();
      });

  });

  after( done => done());

});

describe('/GET user id', () => {
  before(async function () {
    const res = await chai.request(server)
      .post('/api/auth/login')
      .send({
        "email": "manikanta.a@msitprogram.net",
        "password": "Avengersxmen1!"
      });
    // console.log(token);
    token = res.body.token;
  });
  it('it should GET user\'s id', (done) => {
    chai.request(server)
      .get('/api/user/id?token='+token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('id');
        done();
      });

  });

  it('it should GET user\'s id', (done) => {
    chai.request(server)
      .get('/api/user/id?token=invalid')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('error', "Invalid Token");
        done();
      });

  });

  after( done => done());

});

describe('/GET verify admin', () => {

  before(async function () {
    const res = await chai.request(server)
      .post('/api/auth/login')
      .send({
        "email": "manikanta.a@msitprogram.net",
        "password": "Avengersxmen1!"
      });
    // console.log(token);
    token = res.body.token;
  });

    it('it should GET verify admin status', (done) => {
        chai.request(server)
            .get('/api/user/read/verify-admin/eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFraGlsLmRoMkBnbWFpbC5jb20iLCJpYXQiOjE1NTQ0Nzg4MzB9.gOzHJsbHy2IglEak8Kvb1jzaYZY4EwIp_TZV000EnYVSHsDKmBJ0HVM75dyUcNN7yxiTVysrZFzbL1rBgMIA7g')
            .end((err, res) => {
                    res.should.have.status(200);
                    
                expect(res.body).to.deep.equal(true);
                done();
            });
    });

  after( done => done());

});

describe('/GET student list', () => {

  before(async function () {
    const res = await chai.request(server)
      .post('/api/auth/login')
      .send({
        "email": "manikanta.a@msitprogram.net",
        "password": "Avengersxmen1!"
      });
    // console.log(token);
    token = res.body.token;
  });

    it('it should GET student list ', (done) => {
        chai.request(server)
            .get('/api/user/get/student-list')
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array')
                    res.body.forEach(element => {
                        element.should.be.a('object')
                        // console.log(element);

                        expect(element).to.contain.keys('_id', 'email','userID','role');
                    });
                done();
            });
    });

  after( done => done());

});
