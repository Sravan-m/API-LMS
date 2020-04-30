const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongo = require('mongoose');
const fs = require("fs")
var ObjectId = mongo.Types.ObjectId;
const Users = require('../models/userModel');
const acadDetails = require("../models/academicDetailsModel")
const CourseInstances = require('../models/courseInstanceModel');
const Content = require("../models/contentModel");
const Programs = require('../models/programModel');
const ActivityResponses = require('../models/activityResponseModel');
const verifyOptions = require('../jwt').jwt.verifyOptions;
const jwt = require('../jwt').jwt;
const publicKEY = require('../jwt').publicKEY;
const Courses = require('../models/courseModel');
var multer = require('multer')
var upload = multer({ dest: './tmp/' })

router.get('/get-items/', async (req, res) => {
    try {
        // console.log('dd');
        var accessToken = req.query.token;
        var decoded = jwt.verify(accessToken, publicKEY, verifyOptions);
        var userId = await Users.findOne({ "email": decoded.email });
        var query = { "userID": userId._id };
        // console.log(query);
        // var user = req.params.user_id;

        // var query = {
        //     "userID": new ObjectId(user)
        // };
        var activities = []
        var data = await acadDetails.findOne(query);
        var enrolments = data.enrollments;
        // console.log(enrolments);
        for (var i = 0; i < enrolments.length; i++) {
            var courses = enrolments[i].courses;
            for (var j = 0; j < courses.length; j++) {
                var cinstance = courses[j].courseInstances[0];
                var instance = await CourseInstances.find({ _id: cinstance });
                if (instance[0].isLive) {
                    var data = await Content.findOne({ "courseInstanceID": instance[0]._id })
                    if (data != null) {
                        activities.push(data);
                    }
                }
            }
        }

        res.send({ activities });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// /api/todo/todo-list
router.get('/todo-list/', async (req, res) => {
    try {
        // console.log('dd');
        var accessToken = req.query.token;
        var decoded = jwt.verify(accessToken, publicKEY, verifyOptions);
        var userId = await Users.findOne({ "email": decoded.email });
        // console.log(userId);
        if (userId == null) {
        	res.sendStatus(401);
        }
        var query = { "userID": new ObjectId(userId._id) };
        var user = userId._id;

        // var query = {
        //     "userID": new ObjectId(user)
        // };
        var activities = []
        var data = await acadDetails.findOne(query);
        // console.log(data);
        if (data != null) {
            var enrolments = data.enrollments;
            // console.log(enrolments);
            for (var i = 0; i < enrolments.length; i++) {
                var courses = enrolments[i].courses;
                // console.log(courses);
                for (var j = 0; j < courses.length; j++) {
                    var coursename = await Courses.find({ _id: courses[j].courseID })
                    var courseName = coursename[0].courseName;
                    // console.log(courseName);
                    var cinstances = courses[j].courseInstances; // array need to be iterated
                    // console.log(cinstance);
                    for(var a = 0; a < cinstances.length; a++) {
	                    var instance = await CourseInstances.find({ _id: cinstances[a] }); // Iterate all the instances
	                    // console.log(instance)
	                    if (instance[0].isLive) {
	                        // console.log(instance);
	                        // console.log(instance[0]._id);
	                        var data = await Content.findOne({ "courseInstanceID": instance[0]._id })
	                        // console.log(data);
	                        if (data != null) {
	                            var contentJSON = data.contentJSON;
	                            var courseInstanceID = data.courseInstanceID;
	                            for (var l = 0; l < contentJSON.length; l++) {
	                                var moduleName = contentJSON[l].name;
	                                var moduleId = contentJSON[l].module_id;
	                                var contents = contentJSON[l].content;
	                                // console.log(contents.length);
	                                if (contents != null) {
	                                    for (var p = 0; p < contents.length; p++) {
	                                        var activityName = contents[p].activity_name;
	                                        var activityId = contents[p].activity_id;
	                                        var assignmentType = contents[p].activity_json[0].activityType;

	                                        if (assignmentType == "assignment") {
	                                            var etc = contents[p].activity_json[0].dueDate;
	                                            var assignments = {};

	                                            if (etc) {
	                                                assignments["ETC"] = etc;
	                                            } else {
	                                                assignments["ETC"] = "";
	                                            }
	                                            var qres = { "userId": user };
	                                            courseInstanceID ? qres["courseInstanceId"] = courseInstanceID : "";
	                                            moduleId ? qres["moduleId"] = moduleId : "";
	                                            activityId ? qres["activityId"] = activityId : "";
	                                            assignmentType ? qres["activityType"] = assignmentType : "";

	                                            // console.log(activityName);
	                                            const response = await ActivityResponses.find(qres);
	                                            // console.log(response);
	                                            if (response.length == 0) {
	                                                assignments["status"] = false;
	                                            } else {
	                                                assignments["status"] = true;
	                                                // evaluation status 
	                                                // TODO
	                                            }

	                                            // assignments["feedback"] = ;
	                                            assignments["courseName"] = courseName;
	                                            assignments["moduleName"] = moduleName;
	                                            assignments["moduleId"] = moduleId;
	                                            assignments["activityName"] = activityName;
	                                            assignments["activityId"] = activityId;
	                                            activities.push(assignments);
	                                        }
	                                    }
	                                }
	                            }
	                        }
	                    }
	                }
                }
            }
        }
        res.send({ activities });
    } catch (error) {
        console.log("API error");
        res.sendStatus(500);
    }
});

module.exports = router;