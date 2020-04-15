const express = require('express');
const activityResponse = express.Router();
const mongo = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ limit: '100mb' });
const jwt = require('../jwt').jwt;
const verifyOptions =  require('../jwt').jwt.verifyOptions;
const publicKEY = require('../jwt').publicKEY;
const Users = require('../models/userModel');
const ActivityResponses = require('../models/activityResponseModel');
const content = require('../models/contentModel');
const Courses = require('../models/courseModel');
const CourseInstances = require('../models/courseInstanceModel');
var ObjectId = mongo.Types.ObjectId;
const acadDetails=require("../models/academicDetailsModel")

var assert = require('assert');
var Programs = require("../models/programModel");

activityResponse.get('/', (req,res) =>{
    res.send('Inside Activity Response');
});

activityResponse.get('/latest/:user_id?/:program_id?/:course_id?/:course_instance_id?/:module_id?/:activity_id?/:question_id?', getAllLatestActivities);
activityResponse.get('/all/:user_id?/:program_id?/:course_id?/:course_instance_id?/:module_id?/:activity_id?/:question_id?', getAllActivities);
activityResponse.post('/insert',jsonParser, postActivityResponse);
activityResponse.post("/updatemarks",jsonParser,postUpdateMarks);
activityResponse.get('/count/:user_id', getCount);


async function getAllActivities(req,res) {

    try{
        var accessToken = req.query.token;
        var decoded = jwt.verify(accessToken, publicKEY, verifyOptions);
        var userId = await Users.findOne({"email":decoded.email});
        query =  {"userId" : userId._id  };
        req.params.program_id ? query["programId"] = req.params.program_id:"";
        req.params.course_id ? query["courseId"] = req.params.course_id:"";
        req.params.module_id ? query["moduleId"] = req.params.module_id:"";
        req.params.activity_id ? query["activityId"] = req.params.activity_id:"";
        req.params.question_id ? query["questionId"]=req.params.question_id:"";
        const data = await ActivityResponses.find(query);
      res.json(data);
  
    }
    catch(err){
        if(err instanceof jwt.JsonWebTokenError){
            res.status(404).json({"error":"JsonWebTokenError"});
        }
        else{
            // console.log("Error in getAllActivities: ", err );
            res.status(404).json({"error":"JsonWebTokenError"});
        }
    }
  
}


async function postUpdateMarks(req, res)  {
    try{
        // console.log("Inside Update Marks Method Activity Response Collection");
        var accessToken = req.query.token;
        // console.log(req.body);
        var decoded = jwt.verify(accessToken, publicKEY, verifyOptions);
        user = await Users.findOne({"email":decoded.email});
        // console.log(user.role);
        if (user.role == 'mentor') {
            await ActivityResponses.updateOne({"_id": new ObjectId(req.body._id)}, 
            {$set: {"awardedMarks": req.body.awardedMarks, "feedback": req.body.feedback, "evaluationStatus":true, "evaluatedAt":Date.now()}},
            { upsert: false, multi: true });
            res.status(200).json(await ActivityResponses.findOne({"_id": new ObjectId(req.body._id)}));  
        }
    }
    catch(err){
        // console.log("Error in Activity Response POST Update Marks Method", err);
        res.json({"error": err.message});
    }
	
}

async function postActivityResponse (req,res) {
	try{
		// console.log("Inside Activity Response Post");
        // console.log(req.body);
		var accessToken = req.query.token;
		// console.log(accessToken);
		var decoded = jwt.verify(accessToken, publicKEY, verifyOptions);
		// console.log(decoded.email);
			// Getting Response date and setting time zone to IST
		var userId = await Users.findOne({"email":decoded.email});
		req.body.userId = userId._id;
        //  req.body["timestamp"] = date;
        if(req.body.activityType=='quiz' && req.body.response.choices.length<2){
            throw new Error("choices array should be greater than 1");
        }
		 if(req.body.activityType === "quiz"){
			req.body.result ? req.body["awardedMarks"] = req.body.maxMarks : req.body["awardedMarks"] = 0 ;
		 }
		 if(req.body.activityType === "assignment"){
			req.body["evaluationStatus"] = false;
			req.body["awardedMarks"] = 0;
			req.body["feedback"] = "";
		 }
		 console.log(req.body);
		//  console.log(req.body);
		 await new ActivityResponses(req.body).save();
		//  console.log("Inserted to DB in Activity Collection");
		 res.status(200).json({"success":"Response stored successful"});
	}
	catch(err){
        console.log("Error Activity Response POST Method", err);
        res.json({"error" : err.message});
	}
}

async function getAllLatestActivities (req,res) {

    try{
        console.log("Inside Latest Reponse");
        var query =  {};
        console.log('hudhsu');
        console.log(req.params);
        req.params.user_id ? ((req.params.user_id != "_") ? query["userId"] = new ObjectId(req.params.user_id): "") :"";
        console.log(query);
        req.params.program_id ? query["programId"] = new ObjectId(req.params.program_id):"";
        req.params.course_id ? query["courseId"] = new ObjectId(req.params.course_id):"";
        req.params.course_instance_id ? query["courseInstanceId"] = new ObjectId(req.params.course_instance_id):"";
        req.params.module_id ? query["moduleId"] = req.params.module_id:"";
        req.params.activity_id ? query["activityId"] = req.params.activity_id:"";
        req.params.question_id ? query["questionId"] = req.params.question_id:"";
        // query["activityType"] = 'assignment';
        console.log("Query is  --> ",query)
        // data =await Activity.findOne(query).sort({timestamp:-1});
        var data = await ActivityResponses.aggregate([
            {"$match": query},
            {"$sort": {"timestamp": -1}},
            {"$group": {
                "_id":{
                    "userId": "$userId",
                    "courseId": "$courseId",
                    "courseInstanceId":"$courseInstanceId",
                    "moduleId": '$moduleId',
                    "activityId": "$activityId",
                    "questionId": "$questionId"
                }, 
                "item": {"$first": "$$ROOT" }
            }},
            {"$sort": {
                "item.userId": 1,
                "item.courseId": -1,
                "item.courseInstanceId":-1,
                "item.moduleId": -1,
                "item.activityId": -1,
                "item.questionId": 1
            }}
        ]);
        // console.log(data);
        // console.log(data.map(x => x.item));
        data = data.map(x => x.item);
        // console.log(data.length);
        
        await data.map(async (element) => {
            var x = await content.findOne({"courseInstanceID": element["courseInstanceId"]}, 'contentJSON');
            console.log(x);
            x = x.contentJSON.find(e => e.module_id == element["moduleId"]);
            element["moduleId"] = {
                _id: x["module_id"],
                name: x["name"]
            };
            x = x.content.find(e => e.activity_id == element["activityId"]);
            console.log(x);
            element["activityId"] = {
                _id: x["activity_id"],
                name: x["activity_name"]
            };
            console.log(x.activity_json[0].questions);
            x = x.activity_json[0].questions.find(e => e.question_id == element["questionId"]);
            console.log(x.questionText);
            element["questionId"] = {
                _id: x["question_id"],
                text: x["questionText"][0].text
            };
            // console.log(await content.findOne({"courseInstanceID": element.courseInstanceId._id}));
            return element
        });
        console.log(data);
        data = await Users.populate(data, {path: "userId", select: ['firstName', 'lastName','userID','role']});
        data = await Programs.populate(data, {path: 'programId', select: 'programName'});
        data = await CourseInstances.populate(data, {path: 'courseInstanceId', select: 'courseInstanceLabel'});
        data = await Courses.populate(data, {path: 'courseId', select: "courseName"});
        
        // console.log(data);
        if(data.length > 0){
            // console.log(" Inside Latest Response User details are found");
            if (req.params.question_id) res.send(data[0]);
            else res.status(200).json(data);
        }
        else res.status(404).json({ error: 'not found' });
    }
    catch(err){
      console.log("User details are incorrect or not found",err);
      res.json({"error": "error"});
    }
}

async function getCount(req, res) {
    var id = req.params.user_id;
    var query = {"userID": new ObjectId(id)};
    var data = await acadDetails.find(query,{"enrollments.program_id":1}).populate({path: "enrollments.programID",model: 'Programs',select:'programName programDescription'})
    progs = data[0].enrollments.map(x => { return {"programID": new ObjectId(x.programID._id)}});
    console.log(progs)
    data = await acadDetails.findOne(query,{"enrollments.programID": {$in: progs} });
    res.send(data);
}

module.exports = activityResponse;
