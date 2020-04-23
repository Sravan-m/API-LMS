const mongo = require('mongoose');
const Users = require('../models/userModel');
const Courses = require('../models/courseModel');
const Programs = require('../models/programModel');
var fs = require('fs'); 

MONGO_ATLAS_URL = "mongodb+srv://lms:lms123@cluster0-slhrz.mongodb.net/test?retryWrites=true&w=majority";
function startDb() {
  mongo.connect(MONGO_ATLAS_URL, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Mongoos');    
    console.log('Mongodb successfully connected');
    //loadUsers();
    //loadCourses();
    //loadPrograms();
    //loadCurriculam();
    //loadGrades();

  });
  return mongo.connection
    .on('error', console.error)
    .on('disconnected', startDb);
}

// create users.csv from database.
function loadUsers() {
    Users.find(function(err, users) {
        if (err) return err;
        var header = "user.firstName|user.lastName|user.userID|user.email|user.role\n";
        fs.appendFile('users.csv', header, function (err) {
            if (err) throw err;
            console.log(header);
        }); 
        users.forEach(user => {
            var userInfo = user.firstName + "|" +user.lastName+ "|" +
                user.userID+ "|" + user.email+ "|" + user.role + "\n";
            // console.log(userInfo);
            fs.appendFile('users.csv', userInfo, function (err) {
                if (err) throw err;
                console.log(userInfo);
            }); 
        });

    })
}
// create courses.csv from database.
function loadCourses() {
    Courses.find(function(err, courses) {
        if (err) return err;
        var header = "course.courseID|course.courseName|course.isAlive\n";
        fs.appendFile('courses.csv', header, function (err) {
            if (err) throw err;
            console.log(header);
        }); 
        courses.forEach(course => {
            var courseInfo = course.courseID + "|" + course.courseName +
            "|" + course.isAlive + "\n";
            // console.log(userInfo);
            fs.appendFile('courses.csv', courseInfo, function (err) {
                if (err) throw err;
                console.log(courseInfo);
            }); 
        });

    })
}
// create programs.csv from database.
function loadPrograms() {
    Programs.find(function(err, programs) {
        if (err) return err;
        var header = "program.programName|program.batch|program.mentors\n";
        fs.appendFile('programs.csv', header, function (err) {
            if (err) throw err;
            console.log(header);
        }); 
        programs.forEach(program => {
            var programInfo = program.programName + "|" + program.batch 
            + "|" + program.mentors + "\n";
            fs.appendFile('programs.csv', programInfo, function (err) {
                if (err) throw err;
                console.log(programInfo);
            }); 
        });

    })
}
// create curriculum.csv from database.
function loadCurriculam() {
    Programs.find(function(err, programs) {
        if (err) return err;
        var header = "curriculum.courseID|curriculum.courseInstances\n";
        fs.appendFile('curriculam.csv', header, function (err) {
            if (err) throw err;
            console.log(header);
        });
        programs.forEach(program => {
            var curriculams = program.curriculum;
            curriculams.forEach(curriculam => {
                var curriculamInfo = curriculam.courseID + "|" + 
                curriculam.courseInstances +"\n";
                fs.appendFile('curriculam.csv', curriculamInfo, function (err) {
                    if (err) throw err;
                    console.log(curriculamInfo);
                });  
            });
        });

    })
}
// create gradescale.csv from database.
function loadGrades() {
    Programs.find(function(err, programs) {
        if (err) return err;
        var header = "gradeScale.grade|curriculam.points\n";
        fs.appendFile('gradeScale.csv', header, function (err) {
            if (err) throw err;
            console.log(header);
        });
        programs.forEach(program => {
            var gradeScales = program.gradeScale;
            gradeScales.forEach(gradeScale => {
                var gradeScaleInfo = gradeScale.grade + "|" + 
                gradeScale.points +"\n";
                fs.appendFile('gradeScale.csv', gradeScaleInfo, function (err) {
                    if (err) throw err;
                    console.log(gradeScale);
                });  
            });
        });

    })
}
// programName: String,
// batch:[],
// mentors:[],
// curriculum: [{
//     courseID: String,
//     courseInstances: []
// }],
// gradeScale: [{
//     grade: String,
//     points: Number
// }]


// isLive: Boolean,
// enrollment: [],
// batches: [{
//     mentorID: String,
//     studentsID: []
// }],
// numberOfCredits: {type: Number, min:1},
// isCourseRequired: {type: Boolean, default:false}


// courseInstanceLabel: String,
// courseIncharge: [],   
// isLive: Boolean,
// enrollment: [],
// batches: [{
//     mentorID: String,
//     studentsID: []
// }],
// // added by siva after discussed with the team.
// numberOfCredits: {type: Number, min:1},
// isCourseRequired: {type: Boolean, default:false}

var conn = startDb();


