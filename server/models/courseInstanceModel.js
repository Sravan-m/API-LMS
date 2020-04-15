const mongo = require('mongoose');

var CreateCourseInstance = new mongo.Schema({
    courseInstanceLabel: String,
    courseIncharge: [],   
    isLive: Boolean,
    enrollment: [],
    batches: [{
        mentorID: String,
        studentsID: []
    }]
});

CourseInstances = mongo.model("CourseInstances", CreateCourseInstance);

module.exports = CourseInstances;