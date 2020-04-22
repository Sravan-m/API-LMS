const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongo = require('mongoose');
const fs=require("fs")
var ObjectId = mongo.Types.ObjectId;
const acadDetails=require("../models/academicDetailsModel")
const CourseInstances = require('../models/courseInstanceModel');
const Content = require("../models/contentModel");
const Programs = require('../models/programModel');
const ActivityResponses = require('../models/activityResponseModel');


const jsonParser = bodyParser.json({ limit: '100mb' });
const Courses = require('../models/courseModel');
var multer  = require('multer')
var upload = multer({ dest: './tmp/' })



router.get('/get-items/:user_id', async(req, res) => {
    try {
        console.log('dd');
        var user = req.params.user_id;

        var query = {
            "userID": new ObjectId(user)
        };
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
                    var data = await Content.findOne({"courseInstanceID": instance[0]._id })
                    if (data != null) {
                        activities.push(data);
                    }
                }
            }
        }

        res.send({activities});
    } catch (error) {
        console.log('error');
        res.sendStatus(500);
    }
});

router.get('/todo-list/:user_id', async(req, res) => {
    try {
        console.log('dd');
        var user = req.params.user_id;

        var query = {
            "userID": new ObjectId(user)
        };
        var activities = []
        var data = await acadDetails.findOne(query);
        var enrolments = data.enrollments;
        // console.log(enrolments);
        for (var i = 0; i < enrolments.length; i++) {
            var courses = enrolments[i].courses;
            for (var j = 0; j < courses.length; j++) {
                var cinstance = courses[j].courseInstances[0];
                var coursename = await Courses.find({ _id: courses[j].courseID })
                var courseName = coursename[0].courseName;
                var instance = await CourseInstances.find({ _id: cinstance });
                if (instance[0].isLive) {
                    var data = await Content.findOne({"courseInstanceID": instance[0]._id })
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
                                        var assignments = {};
                                        var qres =  {"userId" : user };
                                        courseInstanceID ? qres["courseInstanceId"] = courseInstanceID:"";
                                        moduleId ? qres["moduleId"] = moduleId:"";
                                        activityId ? qres["activityId"] = activityId:"";
                                        assignmentType ? qres["activityType"] = assignmentType:"";

                                        const response = await ActivityResponses.find(qres);
                                        // console.log(response);
                                        if (response.length == 0) {
                                            assignments["status"] = false;
                                        } else {
                                            assignments["status"] = true;
                                        }

                                        // assignments["feedback"] = ;
                                        assignments["courseName"] = courseName;
                                        assignments["moduleName"] = moduleName;
                                        assignments["moduleId"] = moduleId;
                                        assignments["activityName"] = activityName;
                                        assignments["activityId"] = activityId;
                                        assignments["ETC"] = "2 days";
                                        activities.push(assignments);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        res.send({activities});
    } catch (error) {
        console.log("API error");
        res.sendStatus(500);
    }
});

module.exports = router;