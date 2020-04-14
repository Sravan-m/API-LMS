// const express = require('express');
// const app = express();
// const router = express.Router();
const mongo = require('mongoose');

var ChoiceSchema = new mongo.Schema({
	option: {type: String, required: true},
	selected:{type:Boolean, required: true}
}, { _id : false });

function validateChoicesArray(val){
	console.log("***************************");
	console.log(val);
	console.log(ActivityResponseSchema.response);

	return val.length >= 2;
}

var ActivityResponseSchema = new mongo.Schema({
	userId: {type: mongo.Schema.Types.ObjectId, required: true, ref: 'Users'},
	activityType: {type: String, required: true, enum:['quiz','assignment']}, //Quiz or Assignment
	programId: {type: mongo.Schema.Types.ObjectId, required: true, ref: 'Programs'},
	courseId: {type: mongo.Schema.Types.ObjectId, required: true, ref: 'coursecatalog'},
	courseInstanceId: {type: mongo.Schema.Types.ObjectId, required: true, ref: 'CourseInstances'},
	moduleId: {type: String, required: true},
	activityId: {type: String, required: true},
	questionId: {type: String, required: true},
	response: { 
		choices: {type: [ChoiceSchema], required:function () { return this.activityType == 'quiz'} },
		assignment: {type: String, required: function(){ return this.activityType == 'assignment'} }
	},
	result: {type:Boolean, required: function () {return this.activityType == 'quiz'}},
	timestamp: {type: Date, default: Date.now},
	evaluationStatus: {type:Boolean, default:false, required: function(){return this.activityType=='assignment' }},
	maxMarks: {type: Number, required: [true,'Max Marks Required']},
	awardedMarks:  {type: Number,min:0,max:this.maxMarks, required: function(){return this.evaluationStatus && this.activityType=='assignment' }},
	feedback: String,
	evaluatedAt: {type: Date, required: function(){return this.evaluationStatus && this.activityType=='assignment' }}
});

var ActivityResponses = mongo.model('ActivityResponses', ActivityResponseSchema);

module.exports = ActivityResponses;
