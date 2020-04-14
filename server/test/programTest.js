let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server_new');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

chai.request(server)
    .post('/api/auth/login')
    .send({
        "email": "manikanta.a@msitprogram.net",
        "password": "Avengersxmen1!"
    })
    .end((err, res) => {
        res.should.have.status(200);
        res.should.be.a('object');
        token = res.body.token;
    }
    );


describe('/GET all programs in DB', () => {
    it('it should GET all programs from Program table', (done) => {

        chai.request(server)
            .get('/api/program/get/all-programs')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.forEach(element => {
                    // console.log(element)
                    expect(element).to.contain.keys('_id', 'programName', 'curriculum');
                });
                done();
            });
    })
});

describe('/POST for program creation', () => {
    it('it should create program with given json', (done) => {

        chai.request(server)
            .post('/api/program/create')
            .send({
                "programName": "MSIT",
                "curriculum": [
                    {
                        "courseInstances": [],
                        "_id": "5c9144bec5f0843d88097631"
                    },
                    {
                        "courseInstances": [],
                        "_id": "5c91446ec5f0843d8809762f"
                    },
                    {
                        "courseInstances": [],
                        "_id": "5c9143e1c5f0843d8809762e"
                    }
                ]
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.deep.equal(true);
                done();
            });
    });
});

describe('/GET courses', () => {
    it('it should GET only courses names and object IDs', (done) => {
        chai.request(server)
            .get('/api/program/courses/get')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                // console.log(res.body[0]);
                
                res.body.forEach(element => {
                    element.should.have.property('_id');
                    element.should.have.property('courseName');
                });
                done();
            });
    });
})

describe('/GET courses of particular program', () => {
    it('it should GET only courses names and object IDs of particular course', (done) => {
        chai.request(server)
            .get('/api/program/get/curriculum/5c914a03c5f0843d88097633')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');                
                res.body.forEach(element => {
                    element.should.have.property('_id');
                    element.should.have.property('courseName');
                });
                done();
            });
    });
})


describe('/POST for program creation', () => {
    it('it should create program with given json', (done) => {

        chai.request(server)
            .post('/api/program/update/5c914a03c5f0843d88097633')
            .send({
                "_id": {"$oid":"5c914a03c5f0843d88097633"},
                "batch":[],
                "programName":"MSIT 2019",
                "curriculum":[
                    {
                    "courseInstances": [
                        {"$oid":"5cc54f09c3f9217b346e8848"},
                        {"$oid":"5cc54f6386f91c8dd494d297"}],
                        "_id": {"$oid":"5c94e6fb0c297b1774c647a7"}
                    },
                    {
                        "courseInstances":[],
                        "_id":{"$oid":"5c9143e1c5f0843d8809762e"}
                    },
                    {
                        "courseInstances":[],
                        "_id":{"$oid":"5c9144a4c5f0843d88097630"}
                    },
                    {
                        "courseInstances":[],
                        "_id":{"$oid":"5c9144bec5f0843d88097631"}
                    }]
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.deep.equal(true);
                done();
            });
    });
});