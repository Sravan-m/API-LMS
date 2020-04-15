const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongo = require('mongoose');
const fs=require("fs")
var ObjectId = mongo.Types.ObjectId;
const acadDetails=require("../models/academicDetailsModel")
const CourseInstances = require('../models/courseInstanceModel');
const Content = require("../models/contentModel");

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
            // console.log(courses);
            for (var j = 0; j < courses.length; j++) {
                var cinstance = courses[j].courseInstances[0];
                // console.log(cinstance);
                var instance = await CourseInstances.find({ _id: cinstance });
                // console.log(instance);
                if (instance[0].isLive) {
                    // instances.push(instance[0]._id);
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
module.exports = router;