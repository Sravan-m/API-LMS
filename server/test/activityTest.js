let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let token;

chai.use(chaiHttp);



describe('/GET activity response', () => {
  var token;
  before(async function () {
     const res = await chai.request(server)
      .post('/api/auth/login')
      .send({
        "email": "manikanta.a@msitprogram.net",
        "password": "Avengersxmen1!"
      });
      token = res.body.token;
  });


    it('it should GET activity response', (done) => {
        console.log(token);
        chai.request(server)
            .get('/api/activityresponse/latest/5c89fca665dac41c6008ac61/Innosential/Course II: Introduction to Deep Learning/Neural Networks What can a network represent/1/0?token='+token)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('userId');
                    res.body.should.have.property('programId');
                    res.body.should.have.property('courseId');
                    res.body.should.have.property('activityId');
                    res.body.should.have.property('activityType');
                    res.body.should.have.property('courseId');
                    res.body.should.have.property('questionId');
                done();
            });
    });

    it('it should GET activity response', (done) => {

        chai.request(server)
            .get('/api/activityresponse/latest/5c89fca665dac41c6008ac61?token='+token)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                done();
            });
    });

    it('it should not GET activity response', (done) => {

        chai.request(server)
            .get('/api/activityresponse/latest/5c89fca665dac41c6008ac61/i?token='+token)
            .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error', 'not found');
                done();
            });
    });
});

describe('/POST update activity marks', () => {
    it('it should POST activity marks', (done) => {

        chai.request(server)
            .post('/api/activitymarks/updatemarks?token='+token)
            .send( {
                "_id":"5cacb66e2b6f271174af4e38",
                "awardedMarks":"24",
                "feedback":"yes!!"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('userId');
                res.body.should.have.property('programId');
                res.body.should.have.property('courseId');
                res.body.should.have.property('activityId');
                res.body.should.have.property('activityType');
                res.body.should.have.property('courseId');
                res.body.should.have.property('questionId');
                done();
            });
    });

    // it('it should POST activity marks', (done) => {

    //     chai.request(server)
    //         .post('/api/updateactivitymarks/?token=invalid')
    //         .send( {
    //             "_id":"5cacb66e2b6f271174af4e38",
    //             "awardedMarks":"24",
    //             "feedback":"yes!!"
    //         })
    //         .end((err, res) => {
    //             res.should.have.status(404);
    //             done();
    //         });
    // });
});

describe('/POST activity response', () => {

  var token;
  before(async function () {
    const res = await chai.request(server)
      .post('/api/auth/login')
      .send({
        "email": "manikanta.a@msitprogram.net",
        "password": "Avengersxmen1!"
      });
    token = res.body.token;
  });

    it('it should POST activity response for quiz', (done) => {

        chai.request(server)
            .post('/api/activityresponse/insert?token='+token)
            .send( {"programId":"Innosential","courseId":"Course II: Introduction to Deep Learning","moduleId":"Neural Networks","activityType":"quiz","activityId":"1","questionId":0,"response":{"choices":[{"option":"Through the “smart grid”, AI is delivering a new wave of electricity.","selected":false},{"option":"Similar to electricity starting about 100 years ago, AI is transforming multiple industries.","selected":false},{"option":"AI runs on computers and is thus powered by electricity, but it is letting computers do things not possible before.","selected":true},{"option":"AI is powering personal devices in our homes and o ces, similar to electricity.","selected":true}]},"result":false,"maxMarks":1})
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                console.log(res.body);
                res.body.should.have.property('success', 'Response stored successful');
                done();
            });
    });

    it('it should POST activity response for quiz', (done) => {

    chai.request(server)
      .post('/api/activityresponse/insert?token='+token)
      .send( { programId: 'Innosential',
        courseId: 'Course III: Core Deep Learning',
        moduleId: 'Deep Neural Networks Convolutional Networks II',
        activityType: 'assignment',
        activityId: 1,
        questionId: 0,
        response:
          { assignment:
              'https://docs.google.com/document/d/1WXaUpfjIkIsq4NCoVOzDm0TCTWxLvx8KPeSSZccE1FY/edit' },
        maxMarks: 25,
        userId: "5ca6088e6c351e1d24015d33",
        evaluationStatus: false,
        awardedMarks: 0,
        feedback: '' })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.a('object');
        res.body.should.have.property('success', 'Response stored successful');
        done();
      });
  });

  it('it should not POST activity response', (done) => {

    chai.request(server)
      .post('/api/activityresponse?token='+token)
      .send( {
        "courseId":"Course II: Introduction to Deep Learning",
        "moduleId":"Neural Networks",
        "activityType":"quiz",
        "activityId":1,
        "questionId":0,
        "response":{
          "choices":[
            {
              "option":"Through the “smart grid”, AI is delivering a new wave of electricity.",
              "selected":false
            },
            {
              "option":"Similar to electricity starting about 100 years ago, AI is transforming multiple industries.",
              "selected":false
            },
            {
              "option":"AI runs on computers and is thus powered by electricity, but it is letting computers do things not possible before.",
              "selected":true
            },
            {"option":"AI is powering personal devices in our homes and o ces, similar to electricity.",
              "selected":true
            }
          ]
        },
        "result":false,
        "maxMarks":1
      })
      .end((err, res) => {
        console.log(res.body);

        res.should.have.status(401);
        done();
      });
  });

    it('it should not POST activity response', (done) => {

        chai.request(server)
            .post('/api/activityresponse?token=invalid')
            .send( {
              "programId":"Innosential",
              "courseId":"Course II: Introduction to Deep Learning",
              "moduleId":"Neural Networks",
              "activityType":"quiz",
              "activityId":1,
              "questionId":0,
              "response":{
                "choices":[
                  {
                    "option":"Through the “smart grid”, AI is delivering a new wave of electricity.",
                    "selected":false
                  },
                  {
                    "option":"Similar to electricity starting about 100 years ago, AI is transforming multiple industries.",
                    "selected":false
                  },
                  {
                    "option":"AI runs on computers and is thus powered by electricity, but it is letting computers do things not possible before.",
                    "selected":true
                  },
                  {"option":"AI is powering personal devices in our homes and o ces, similar to electricity.",
                    "selected":true
                  }
                ]
              },
              "result":false,
              "maxMarks":1
            })
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    after( done => done());
});

