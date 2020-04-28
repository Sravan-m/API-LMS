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
const getId = require('./user');
// const winston = require('winston');
// const assert = require('assert');
const mongo = require('mongoose');
var ObjectId = mongo.Types.ObjectId;

/**
 * The function getNumberOfRequiredCourses returns the number of 
 * required courses based on the courses that are in the curriculum given a 
 * program.
 * @param programID: Program ID used for finding the number of required course.
 * @return number of courses required. 
 * returns 0 if the program id is invalid or there are no courses in the curriculum
 */

async function getNumberOfRequiredCourses(programID) {
	var numberOfRequiredCourses = 0;
	
	const progData = await Programs.findOne(programID);
	if (progData === null) {
		return 0;
	}

	const curriculumData = progData.curriculum;
	if (progData === null) {
		return 0;
	}

	for (var i = 0; i < curriculumData.length; i++) {
		if (curriculumData[i].courseInstances.length > 0) {
			var courseInstanceData = await CourseInstances.findOne(curriculumData[i].courseInstances[0]);
			if (courseInstanceData.isCourseRequired === true)
				numberOfRequiredCourses += 1;
		}
	}

	console.log("Number of required courses are:", numberOfRequiredCourses);
	return numberOfRequiredCourses;
};


/**
 * @api {get} /required/courses/completion/ Request user required course completion status.

 * @apiName Required course completion status.
 * @apiGroup Academic details.
 *
 * @apiParam {token} as part of request query parameter.
 *
 * @apiSuccess {String} courses, grades, status, isPromoted.
 * @apiFailure {String} specific errors will be returned.
 */

router.get("/required/courses/completion/", async (req, res) => {
	var userID;
	// try {
	// 	const idResponse = await getId();
	// 	console.log(idResponse);
	// 	userID = idResponse["id"];
	// } catch (error) {
	// 	console.log("Error.. in getID function....")
	// }
	
	// console.log("Siva Sankar", res);
	
	try {
		var accessToken = req.query.token;
	    var decoded = jwt.verify(accessToken, publicKEY, verifyOptions);
	    var userID = await Users.findOne({"email":decoded.email});
	    if (userID === null) {
	    	res.status(401).send({"error": "Invalid user, Please login again..."});
	    }

	    query =  {"userID" : userID  };
        var data = await acadDetails.findOne(query);
        console.log(data);
        if (data === null) {
        	res.status(401).send({"error":"Data is not available"});
        }

        var prog = await Programs.findOne(data.programID);
        if (prog === null) {
        	res.status(401).send({"error":"Student not enrolled in any of the programs"});
        }

        var enrollments = data.enrollments;
        if (enrollments === null) {
        	res.status(401).send({"error":"Student not enrolled into any of the courses"});
        }

        result = "";
        courses = [];
        grades = [];
        status = [];
        points = [];

        const numberOfRequiredCourses = getNumberOfRequiredCourses(data.enrollments[0].programID);
        for (var i = 0; i < enrollments.length; i++) {
            var courss = enrollments[i].courses;
			//	The size of the arrays of courseInstances, grades, status should be equal.
            for (var j = 0; j < courss.length; j++) {
            	if (courss[j].grades.length !== courss[j].status.length && courss[j].status.length !== courss[j].courseInstances.length) {
					// res.status(401).send({"status": "Grades are not currently available."});
				} else {
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
						} else {
							break;
						}
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
        				"isPromoted" : status 	};
        res.status(200).json(result);
    } catch (error) {
    	console.log(error);
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


