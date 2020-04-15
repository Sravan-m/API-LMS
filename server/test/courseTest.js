let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
const expect=chai.expect;

var token;
chai.use(chaiHttp);

describe('/GET catalog', () => {

  before(async function () {
    const res = await chai.request(server)
      .post('/api/auth/login')
      .send({
        "email": "manikanta.a@msitprogram.net",
        "password": "Avengersxmen1!"
      });
    token = res.body.token;
  });
    it('it should GET catalog', (done) => {
        chai.request(server)
            .get('/api/course/get/catalog&token='+token)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.forEach(element => {
                        element.should.be.a('object')
                        console.log(element)
                        expect(element).to.contain.keys('courseID', 'courseName','courseDescription');
                    });
                done();
            });
    });

  after( done => done());

});

describe('/POST for creating course', () => {
  before(async function () {
    const res = await chai.request(server)
      .post('/api/auth/login')
      .send({
        "email": "manikanta.a@msitprogram.net",
        "password": "Avengersxmen1!"
      });
    token = res.body.token;
  });
    it('it should POST for creating course', (done) => {

        chai.request(server)
            .post('/api/course/create&token='+token)
            .send({
                "courseID": "DBMS-1",
                "courseName": "Data Base Management System",
                "courseDescription":"Gives a idea about how to use DB to store data",
                "isAlive":"true"
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.deep.equal(true);
                done();
            });
    });

  after( done => done());
});
describe('/POST for getting course names', () => {
  before(async function () {
    const res = await chai.request(server)
      .post('/api/auth/login')
      .send({
        "email": "manikanta.a@msitprogram.net",
        "password": "Avengersxmen1!"
      });
    token = res.body.token;
  });
    it('it should POST for getting course names', (done) => {

        chai.request(server)
            .post('/api/course/get/course-names&token='+token)
            .send([{"_id":"5c91446ec5f0843d8809762f"},{"_id":"5c9143e1c5f0843d8809762e"}])
            .end((err, res) => {
                res.should.have.status(200);
                // res.body.should.be.a('array');
                res.body.forEach(element => {
                   
                    console.log(element)
                    expect(element[0]).to.contain.keys('_id', 'courseName');
                });
                done();
            });
    });

  after( done => done());
});


describe('/POST for updating course', () => {
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

    it('it should POST for updating course', (done) => {

        chai.request(server)
            .post('/api/course/update/catalog&token='+token)
            .send([{
                "courseID": "DBMS-12",
                "courseName": "Data Base Management System",
                "courseDescription":"Gives a idea about how to use DB to store data",
                "isAlive":"true"
            }])
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.deep.equal(true);
                done();
            });
    });

  after( done => done());

});


