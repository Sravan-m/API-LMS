const mongo = require('mongoose');
const User = require('./userModel');

var AcademicDetailsSchema = new mongo.Schema({
    userID: {type: mongo.Schema.Types.ObjectId, required: true, ref: 'Users'},
    enrollments: [{
        programID: {type: mongo.Schema.Types.ObjectId, required: true, ref: 'Programs'},
        courses: [{
            courseID: {type:mongo.Schema.Types.ObjectId, ref: 'CourseCatalog'},
            courseInstances: [{type:mongo.Schema.Types.ObjectId, ref: 'CourseInstances'}],
            grades: [{
                // Letter grades as defined in the gradeScale in Program
            	grade: { type : String },
            	courseInstance: {type:mongo.Schema.Types.ObjectId, ref: 'CourseInstances'}
            }],
            status: [{
                //  Possible values: Registered, Course in-progress, Evaluations in-progress, 
                //  Course completed
            	status: { type: String, default: "Registered" },
            	courseInstance: {type:mongo.Schema.Types.ObjectId, ref: 'CourseInstances'}
            }]
        }]
    }]
});

AcademicDetails = mongo.model('AcademicDetails', AcademicDetailsSchema);

module.exports = AcademicDetails;

