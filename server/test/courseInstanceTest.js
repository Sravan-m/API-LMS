let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
const expect=chai.expect;

var token;
chai.use(chaiHttp);
describe('/GET courses and course instances', () => {

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

  it('it should GET courses and course instances', (done) => {
    chai.request(server)
      .get('/api/course-instance/courses/get/5c914a03c5f0843d88097633')
      .end((err, res) => {
        res.should.have.status(200);
        res.body[0].should.be.a('object');


        expect(res.body[0]).to.contain.keys('_id', 'curriculum');
        res.body[0].curriculum.should.be.a('array');
        res.body[0].curriculum.forEach(obj => {
          expect(obj).to.contain.keys('courseInstances', '_id');
          obj.courseInstances.should.be.a('array');
        })

        done();
      });
  });

  after( done => done());
});

describe('/GET all programs in DB', () => {

    before(async function () {
      const res = await chai.request(server)
        .post('/api/auth/login')
        .send({
          "email": "manikanta.a@msitprogram.net",
          "password": "Avengersxmn1!"
        });
      token = res.body.token;
    });

});


describe('/POST for creating course instance', () => {

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

    it('it should POST for creating course instance', (done) => {

        chai.request(server)
            .post('/api/course-instance/create')
            .send({
                
                "programID":"5c914a03c5f0843d88097633",
                "courseID":"5c94e6fb0c297b1774c647a7",
                "courseIncharge": ["5c89fb5a65dac41c6008ac5e","5c89fb9a65dac41c6008ac5f"],
                "courseInstructor": ["5c89fb0d65dac41c6008ac5d"],
                "enrollment":[],
                "isAlive":"true"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('string');
                
                done();
            });
    });

  after( done => done());

});
