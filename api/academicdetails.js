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


//  Getting the user based on access token.
async function getUser(accessToken) {
    try {
        const decoded = jwt.verify(accessToken, publicKEY, verifyOptions);
        const user = await Users.findOne({ "email": decoded.email });
        return user;
    } catch(error) {
        console.log("error: Invalid token");
    }
}

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
router.get("/required/courses/completion/", async (req, res, next) => {

    try {
        const user = await getUser(req.query.token);
        if (user === null) {
            throw new Error("Invalid user, Please login again...");
            // return res.status(401).send(
            //     { "error": "Invalid user, Please login again..." });
        }

        query = { "userID": user._id };
        

        //  Getting the students academic details
        const acadDetails = await AcadDetails.findOne(query);
        if (acadDetails === null) {
            throw new Error("Student not enrolled in any of the programs");
            // return res.status(401).send(
            //     { "error": "Student not enrolled in any of the programs" });
        }

        //  Getting the students course enrollments of a program
        const enrollments = acadDetails.enrollments;
        if (enrollments === null) {
            throw new Error("Student not enrolled into any of the courses");
            // return res.status(401).send(
            //     { "error": "Student not enrolled into any of the courses" });
        }

        //  Getting the programs details. This will be used for getting the grade scale.
        const program = await Program.findOne(enrollments[0].programID);
        if (program === null) {
            throw new Error("Student not enrolled in any of the programs");
            // return res.status(401).send(
            //     { "error": "Student not enrolled in any of the programs" });
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
                // console.log(courss[j]);
                if (!("grades" in courss[j]) || !("status" in courss[j])) {
                    throw new Error("Grades are yet to be updated.");
                    // return res.status(401).send(
                    //     {"error": "Grades are yet to be updated."});
                }
                if (courss[j].grades.length !== courss[j].status.length && 
                    courss[j].status.length !== courss[j].courseInstances.length) {
                    throw new Error("Grades are not currently available.");
                    // return res.status(401).send(
                    //     {"error": "Grades are not currently available."});
                } else {
                    let courseDetails = await CCatalog.findOne(courss[j].courseID);
                    for (let k = 0; k < courss[j].grades.length; k++) {
                        let instance = await CInstances.findOne({ _id: courss[j].grades[k].courseInstance });
                        if (!("isCourseRequired" in instance)) {
                            throw new Error("Grades are yet to be updated.");
                            // return res.status(401).send(
                            //     {"error": "Grades are yet to be updated."});
                        }
                        if (instance.isCourseRequired === true) {
                            let courseDetails = await CCatalog.findOne(courss[j].courseID);
                            if (!("numberOfCredits" in instance)) {
                                throw new Error("Grades are yet to be updated.");
                                // return res.status(401).send(
                                //     {"error": "Grades are yet to be updated."});
                            }
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
                    obj.grade = "On-going";
                    incompleteCnt += 1;
                } else {
                    obj.grade = grades[maxJ];
                }
                results.push(obj);
            }
        }
        // console.log(results.length);
        const cstatus = (results.length) ? ((incompleteCnt)? false : true) : false;
        console.log("Sent the Response");
        res.status(200).json({
            result: results,
            isPromoted: cstatus,
            CGPA: score/totalCredits
        });
    } catch (error) {
        console.log(error.message);
        return res.status(401).send({"error": error.message});
    }
});

module.exports = router;