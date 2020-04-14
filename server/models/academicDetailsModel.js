const mongo = require('mongoose');
const User = require('./userModel');

var AcademicDetailsSchema = new mongo.Schema({
    userID: {type: mongo.Schema.Types.ObjectId, required: true, ref: 'Users'},
    enrollments : [{
        programID: {type: mongo.Schema.Types.ObjectId, required: true, ref: 'Programs'},
        courses: [{
            courseID: {type:mongo.Schema.Types.ObjectId, ref: 'CourseCatalog'},
            courseInstances: [{type:mongo.Schema.Types.ObjectId, ref: 'CourseInstances'}]
        }]
    }]
});

AcademicDetails = mongo.model('AcademicDetails', AcademicDetailsSchema);

module.exports = AcademicDetails;