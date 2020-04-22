const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ limit: '100mb' });
const Programs = require('../models/programModel');
const Users = require('../models/userModel');
const CourseInstances = require('../models/courseInstanceModel');
const CourseCatalog = require('../models/courseModel');
const acadDetails = require("../models/academicDetailsModel")

const User = require('./user')
const mongo = require('mongoose');
var ObjectId = mongo.Types.ObjectId;

router.get("/required/courses/completion/:user_id", async (req, res) => {
	try {
        console.log("Here...1", req.params.user_id);
        var user = req.params.user_id;

        var query = {
            "userID": new ObjectId(user)
        };

        var data = await acadDetails.findOne(query);

        var prog = await Programs.findOne(data.programID);
        console.log(prog.gradeScale);

        var enrolments = data.enrollments;
        result = "";
        courses = [];
        grades = [];
        status = [];
        points = [];
        for (var i = 0; i < enrolments.length; i++) {
            var courss = enrolments[i].courses;
            for (var j = 0; j < courss.length; j++) {
            	var courseDetails = await CourseCatalog.findOne(courss[j].courseID);
				// console.log("Course Name : ", courseDetails.courseName);
            	for (var k = 0; k < courss[j].grades.length; k++) {
					var cinstance = courss[j].grades[k].courseInstance;
					console.log(cinstance);
					var instance = await CourseInstances.findOne({ _id: cinstance });
					console.log(instance);
					if (instance.isCourseRequired === true) {
						var courseDetails = await CourseCatalog.findOne(courss[j].courseID);
						console.log(courseDetails.courseName, courss[j].grades[k].grade);
						courses.push(courseDetails.courseName);
						grades.push(courss[j].grades[k].grade);
						status.push(courss[j].status[k].status);

						var idx = prog.gradeScale.findIndex(x => x.grade === courss[j].grades[k].grade);
						var pts = prog.gradeScale[idx].points;
						console.log(idx, prog.gradeScale[idx].points);
						points.push(prog.gradeScale[idx].points);
					}
					else {
						break;
					}
            	}
            }
        }

        var tmpCourses = [];
        var tmpGrades = [];
        var tmpStatus = [];
        var incompleteCnt = 0;
        for (var i = 0; i < courses.length; i++) {
        	var prevPts = points[i];
        	var flag = true;
        	var maxJ = i;
        	for (var j = i+1; j < courses.length; j++) {
        		if (courses[i] === courses[j] && prevPts < points[j]) {
        			maxJ = j;
        			prevPts = points[j];
        			flag = false;
        		}
        	}
        	if (flag){
	    		tmpCourses.push(courses[maxJ]);
				tmpGrades.push(grades[maxJ]);
				tmpStatus.push(status[maxJ]);
			}
        }
        for (var i = 0; i < tmpGrades.length; i++) {
        	if (tmpGrades[i] === "Incomplete") {
        		incompleteCnt += 1;
        	}
        	if (tmpStatus[i] === "Evaluations in-progress" || 
        		tmpStatus[i] === "Course in-progress" || 
        		tmpStatus[i] === "Registered") {
        			incompleteCnt += 1;	
        	}
        }
        // JSONObject profile = new JSONObject();
        var status = (incompleteCnt) ? "Not promoted to second year" : "Promoted to second year";
        
        console.log(tmpCourses);
        console.log(tmpGrades);

        var result = { 	"courses": tmpCourses,
        				"grades": tmpGrades,
        				"status": tmpStatus,
        				"isPromoted" : status
        			};
        res.json(result);
    } catch (error) {
    	console.log(error)
        res.sendStatus(500);
    }
});

module.exports = router;


// {
// 	"courses" : [1,2,3,4],
// 	"grades" : ["a+", -,-,-]
// 	"status" : ["course completed","registered","inprogress","Incompelete"],
// 	"overallStatus" : "Welcome to MSIT and you are not registered. Write to help"
// }

