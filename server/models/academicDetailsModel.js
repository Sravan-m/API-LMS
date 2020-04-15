const mongo = require('mongoose');
const User = require('./userModel');

var AcademicDetailsSchema = new mongo.Schema({
    userID: {type: mongo.Schema.Types.ObjectId, required: true, ref: 'Users'},
    enrollments : [{
        programID: {type: mongo.Schema.Types.ObjectId, required: true, ref: 'Programs'},
        courses: [{
            courseID: {type:mongo.Schema.Types.ObjectId, ref: 'CourseCatalog'},
            courseInstances: [{type:mongo.Schema.Types.ObjectId, ref: 'CourseInstances'}],
            // added by siva after discussed with the team and Murthy.
            grades: [
            	grade : {type: String}, // Ex, A+, A, B+, B, C, Incomplete
            	courseInstance: {type:mongo.Schema.Types.ObjectId, ref: 'CourseInstances'}
            ],
            // added by siva after discussed with the team and Murthy.
            status: [
            	status: {type: String, default: "Course in-progress"},
            				// Course in-progress / Evaluation in progress / Course Completed
            	courseInstance: {type:mongo.Schema.Types.ObjectId, ref: 'CourseInstances'}
            ]
        }]
    }]
});

AcademicDetails = mongo.model('AcademicDetails', AcademicDetailsSchema);

module.exports = AcademicDetails;
