const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Program = require('../models/programModel');
const Users = require('../models/userModel');
const CInstances = require('../models/courseInstanceModel');
const CCatalog = require('../models/courseModel');
const AcadDetails = require("../models/academicDetailsModel")
const jwt = require('../jwt').jwt;
const verifyOptions = require('../jwt').jwt.verifyOptions;
const publicKEY = require('../jwt').publicKEY;
const mongo = require('mongoose');
let ObjectId = mongo.Types.ObjectId;


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

//  Getting the user based on access token.
async function getUser(accessToken) {
    try {
        console.log(accessToken);
        const decoded = jwt.verify(accessToken, publicKEY, verifyOptions);
        const user = await Users.findOne({ "email": decoded.email });
        return user;
    } catch(error) {
        console.log("error: Invalid token");
    }
}

router.get("/required/courses/completion/", async (req, res, next) => {

    try {
        const user = await getUser(req.query.token);

        query = { "userID": user._id };
        if (user === null) {
            return res.status(401).send(
                { "error": "Invalid user, Please login again..." });
        }

        //  Getting the students academic details
        const acadDetails = await AcadDetails.findOne(query);
        if (acadDetails === null) {
            return res.status(401).send(
                { "error": "Student not enrolled in any of the programs" });
        }

        //  Getting the programs details. This will be used for getting the grade scale.
        const program = await Program.findOne(acadDetails.programID);
        if (program === null) {
            return res.status(401).send(
                { "error": "Student not enrolled in any of the programs" });
        }

        //  Getting the students course enrollments of a program
        const enrollments = acadDetails.enrollments;
        if (enrollments === null) {
            return res.status(401).send(
                { "error": "Student not enrolled into any of the courses" });
        }

        //  Used to store the course names 
        let courses = [];
        
        //  Used to store the grades obtained in the courses enrolled
        let grades = [];
        
        //  Used to store the status obtained in the courses enrolled
        let status = [];
        
        //  Used to store the points obtained in the courses enrolled
        let points = [];
        
        //  Used to store the credits obtained in the courses enrolled
        let credits = [];

        //  Getting the course details from the course enrollments.
        for (let i = 0; i < enrollments.length; i++) {
            let courss = enrollments[i].courses;
            for (let j = 0; j < courss.length; j++) {
                if (courss[j].grades.length !== courss[j].status.length && 
                    courss[j].status.length !== courss[j].courseInstances.length) {
                    res.status(401).send(
                        {"status": "Grades are not currently available."});
                } else {
                    let courseDetails = await CCatalog.findOne(courss[j].courseID);
                    for (let k = 0; k < courss[j].grades.length; k++) {
                        let instance = await CInstances.findOne({ _id: courss[j].grades[k].courseInstance });
                        if (instance.isCourseRequired === true) {
                            let courseDetails = await CCatalog.findOne(courss[j].courseID);
                            credits.push(instance.numberOfCredits);
                            courses.push(courseDetails.courseName);
                            grades.push(courss[j].grades[k].grade);
                            status.push(courss[j].status[k].status);

                            //  Finding the index of the grade in the gradeScale to get the points
                            const idx = program.gradeScale.findIndex(x => x.grade === courss[j].grades[k].grade);
                            if (idx === -1) {
                                points.push(0);
                            } else {
                                let pts = program.gradeScale[idx].points;
                                points.push(program.gradeScale[idx].points);
                            }
                        } else {
                            break;
                        }
                    }
                }
            }
        }

        //  Pushing all the information related to a course.
        let results = [];

        //  Calculating the incomplete courses count
        let incompleteCnt = 0;

        let totalCredits = 0;
        let score = 0;

        for (let i = 0; i < courses.length; i++) {
            let prevPts = points[i];
            let flag = true;
            let maxJ = i;

            //  Finding the best grade index.
            for (let j = i + 1; j < courses.length; j++) {
                if (courses[i] === courses[j] && prevPts < points[j]) {
                    maxJ = j;
                    prevPts = points[j];
                    flag = false;
                }
            }

            if (flag) {
                obj = {};
                obj.courseName = courses[maxJ];
                obj.status = status[maxJ];
                obj.credits = credits[maxJ];
                obj.points = points[maxJ];

                score += points[maxJ] * credits[maxJ];
                totalCredits += credits[maxJ];
                
                if (grades[maxJ] === "Incomplete") {
                    obj.grade = "Incomplete";
                    incompleteCnt += 1;
                } else if (grades[maxJ] === "none" ||
                    status[maxJ] === "Evaluations in-progress" ||
                    status[maxJ] === "Course in-progress" ||
                    status[maxJ] === "Registered") {
                    obj.grade = "-";
                    incompleteCnt += 1;
                } else {
                    obj.grade = grades[maxJ];
                }
                results.push(obj);
            }
        }

        const cstatus = (incompleteCnt) ? false : true;

        res.status(200).json({
            result: results,
            isPromoted: cstatus,
            CGPA: score/totalCredits
        });

        console.log("Sent the Response");
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;