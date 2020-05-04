const mongo = require('mongoose');

var CreateProgramSchema = new mongo.Schema({
    programName: String,
    curriculum: [{
        courseID: String,
        courseInstances: []
    }],
    batch:[],
    mentors:[],
    programDescription:String,
    calendar: String,
    // added by siva after discussed with the team.
    gradeScale: [{
        grade: String,
        points: Number
    }]
});

Programs = mongo.model('Programs', CreateProgramSchema);

module.exports = Programs;