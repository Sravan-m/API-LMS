const mongo = require('mongoose');

var CreateCourseInstance = new mongo.Schema({
    courseInstanceLabel: String,
    courseIncharge: [],   
    isLive: Boolean,
    enrollment: [],
    batches: [{
        mentorID: String,
        studentsID: []
    }],
    // added by siva after discussed with the team.
    numberOfCredits: {type: Number, min:1},
    isCourseRequired: {type: Boolean, default:false}
});

CourseInstances = mongo.model("CourseInstances", CreateCourseInstance);

module.exports = CourseInstances;