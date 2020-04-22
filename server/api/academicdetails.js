const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ limit: '100mb' });
const Programs = require('../models/programModel');
const Users = require('../models/userModel');
const CourseInstances = require('../models/courseInstanceModel');
const CourseCatalog = require('../models/courseModel');
const acadDetails = require("../models/academicDetailsModel")
const axios = require('axios');
const jwt = require('../jwt').jwt;
const verifyOptions = require('../jwt').jwt.verifyOptions;
const publicKEY = require('../jwt').publicKEY;
const User = require('./user')
const winston = require('winston');
const assert = require('assert');
const mongo = require('mongoose');
var ObjectId = mongo.Types.ObjectId;

const logger = winston.createLogger({
  level: 'info',
  // format: winston.format.json(),
  format: winston.format.combine(
    // winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'info.log', level: 'info' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});


router.get("/required/courses/completion/", async (req, res) => {
	try {

  		// var url = "http://localhost:3000/api/user/id?token="+req.query.token;
		// const response = await axios.get(url);
		var userID;
		try {
			var accessToken = req.query.token;
			console.log(accessToken);
			var decoded = jwt.verify(accessToken, publicKEY, verifyOptions);
			// console.log("token verify--->", decoded);
			// console.log(await Users.find({"email":decoded.email}))
			var user = await Users.findOne({ "email": decoded.email });
			assert(user, "Not Found");
			// logger.info("User's id sent successfully");
			userID = user._id;
			// res.json({ 'id': user._id });
		} catch (err) {
			if (err instanceof jwt.JsonWebTokenError) {
				logger.error('Invalid token');
				res.status(404).end("Invalid Token");
			}
			logger.error("Error in getting user's id -->" + err.message);
			res.json({ "error": err.message });
		}

        var query = {
            "userID": new ObjectId(userID)
        };

        var data = await acadDetails.findOne(query);

        var prog = await Programs.findOne(data.programID);
        // console.log(prog.gradeScale);

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
					// console.log(cinstance);
					var instance = await CourseInstances.findOne({ _id: cinstance });
					// console.log(instance);
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
        	if (flag) {
	    		tmpCourses.push(courses[maxJ]);
				tmpStatus.push(status[maxJ]);
				if (grades[maxJ] === "Incomplete" || 
						status[maxJ] === "Evaluations in-progress" || 
	       				status[maxJ] === "Course in-progress" || 
        				status[maxJ] === "Registered") {
					tmpGrades.push("-");
					incompleteCnt += 1;
				} else {
					tmpGrades.push(grades[maxJ]);
				}
			}
        }

        var status = (incompleteCnt) ? "Not promoted to second year" : "Promoted to second year";
        
        console.log(tmpCourses);
        console.log(tmpGrades);
        console.log(tmpStatus);

        var result = { 	"courses": tmpCourses,
        				"grades": tmpGrades,
        				"status": tmpStatus,
        				"isPromoted" : status
        			};
        res.status(200).json(result);
    } catch (error) {
    	console.log(error)
        res.sendStatus(500);
    }
});

module.exports = router;

// On success.... the response could be as follows
// {
// 	"courses" : [1,2,3,4],
// 	"grades" : ["a+", -,-,-]
// 	"status" : ["course completed","registered","inprogress","Incompelete"],
// 	"overallStatus" : "Welcome to MSIT and you are not registered. Write to help"
// }


// On failure.... the response could be as follows
// {
//     "error": "Invalid Token"
// }


