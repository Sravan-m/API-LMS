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
    calendar: String
});

Programs = mongo.model('Programs', CreateProgramSchema);

module.exports = Programs;