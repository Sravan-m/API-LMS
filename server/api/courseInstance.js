const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ limit: '100mb' });
const multer = require('multer');
const upload = multer({ dest: process.env.UPLOADS_DIR });
const csv = require('csv-parser');
const fs = require('fs');

const Programs = require('../models/programModel');
const Users = require('../models/userModel');
const CourseInstances = require('../models/courseInstanceModel');
const AcademicDetails = require('../models/academicDetailsModel');

router.get("/courses/get/:programID", async (req, res) => {
    try {
        let programID = req.params.programID;
        var data = await Programs.find({ _id: programID }, { curriculum: 1 });
        console.log(data);
        res.send(data);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.post("/create", jsonParser, async (req, res) => {
    try {
        var data = req.body;
        data.isLive = true;
        data.batch = [];
        var courseInstanceObject = await CourseInstances(data).save();
        let programObject = await Programs.find({ _id: data.programID });
        console.log(programObject);
        programObject[0].curriculum.find(courseObject => courseObject._id == data.courseID).courseInstances.push(courseInstanceObject._id);
        console.log(programObject[0]);
        console.log(programObject[0].curriculum.find(courseObject => courseObject._id == data.courseID));

        await Programs.update({ '_id': data.programID }, { $set: programObject[0] });
        res.send(courseInstanceObject);
    } catch (error) {
        console.log(error);
    }
});

router.post("/get/courseInstance-names", jsonParser, async (req, res) => {
    try {
        var coursesIDArray = req.body;
        console.log(req.body);
        var coursesNames = [];
        for (let index = 0; index < coursesIDArray.length; index++) {
            const courseID = coursesIDArray[index];
            let instanceNames = [];
            for (let index2 = 0; index2 < courseID.courseInstances.length; index2++) {
                var data2 = await CourseInstances.find({ _id: courseID.courseInstances[index2] });
                instanceNames.push(data2[0]);
            }
            coursesNames.push(instanceNames)



            if (coursesIDArray.length - 1 == index) {
                res.send(coursesNames);
            }
        }
    } catch (error) {
        res.sendStatus(500);
    }
});
router.post("/status/update", jsonParser, async (req, res) => {
    try {

        var modifiedInstances = req.body;
        let dictsize = 0;
        let modifiedsize = 0;
        for (var id in modifiedInstances) {
            dictsize = dictsize + 1;
        }
        for (var id in modifiedInstances) {
            var data = await CourseInstances.update({ _id: id }, { isLive: modifiedInstances[id] });
            modifiedsize = modifiedsize + 1;
            if (modifiedsize == dictsize) { res.send(true) }
        }
    } catch (error) {
        console.log("Error at /status/update");
        console.log(error);
        res.sendStatus(500);
    }
});
router.get("/status/isLive/:courseInstanceID", async (req, res) => {
    try {
        let courseInstanceID = req.params.courseInstanceID;
        var data = await CourseInstances.findOne({ _id: courseInstanceID });
        console.log("Inside Course Instance");
        console.log(data.isLive);
        res.json({ "status": data.isLive });
    } catch (error) {
        res.sendStatus(500);
    }
});
router.post("/update/batch/:programID/:courseID/:courseInstanceID", upload.array("csv[]", 2), async (req, res) => {
    console.log(req.params.programID);
    console.log(req.params.courseID);
    console.log(req.params.courseInstanceID);
    console.log(req.body)
    let courseInstanceID = req.params.courseInstanceID;
    let data = {
        invalidData: [],
        validData: [],
    };
    let tasks = [];
    let mentors = {};
    let students = {};
    let errorFlag = false;
    let batch = [];
    let mentorsArray = await Users.find({ 'role': 'mentor' }, { 'email': 1 });
    mentorsArray.forEach(mentor => {
        mentors[mentor.email] = mentor._id;
    });
    // console.log(mentors);
    let studentsArray = await Users.find({ 'role': 'student' }, { 'email': 1 });
    studentsArray.forEach(student => {
        students[student.email] = student._id;
    });
    // console.log(students);
    fs.createReadStream(req.files[0].path)
        .pipe(csv())
        .on('data', (row) => {
            tasks.push(row);
        })
        .on('end', async () => {
            console.log('CSV file successfully processed');
            for (let index = 0; index < tasks.length; index++) {
                const row = tasks[index];
                // console.log(row.Name);
                let user = await Users.findOne({ 'email': row.studentEmail });

                console.log(user);
                if (user) {
                    if (row.mentorEmail in mentors) {
                        row.Status = "success";
                        data.validData.push(row);
                        let index = batch.findIndex(mentor => mentor.mentorID == mentors[row.mentorEmail]);
                        if (index === -1) batch.push({ "mentorID": mentors[row.mentorEmail], "studentsID": [students[row.studentEmail]] });
                        else batch[index].studentsID.push(students[row.studentEmail]);
                        let acadDetailsExists = await AcademicDetails.find({ "userID": students[row.studentEmail], "enrollments.programID": req.params.programID, "enrollments.courses.courseID": req.params.courseID, "enrollments.courses.courseInstances": req.params.courseInstanceID });
                        let acadMenDetailsExists = await AcademicDetails.find({ "userID": mentors[row.mentorEmail], "enrollments.programID": req.params.programID, "enrollments.courses.courseID": req.params.courseID, "enrollments.courses.courseInstances": req.params.courseInstanceID });
                        
                        console.log("this is jai fasak");
                        // console.log(acadDetailsExists);
                        

                        let acads = await AcademicDetails.findOne({ "userID": students[row.studentEmail] }, { "enrollments": { $elemMatch: { programID: req.params.programID } } })

                        if (acadDetailsExists.length == 0 && acads) {
                            let acads = await AcademicDetails.findOne({ "userID": students[row.studentEmail] }, { "enrollments": { $elemMatch: { programID: req.params.programID } } })
                            console.log(students[row.studentEmail])
                            console.log(acads);
                            if (acads.enrollments[0].courses==null) {
                                acads.enrollments[0].courses = []
                            }

                            let index = acads.enrollments[0].courses.findIndex(function (element) {
                                return element.courseID == req.params.courseID;
                            });
                            console.log(index);
                            if (index == -1) {
                                acads.enrollments[0].courses. push({
                                    courseID: req.params.courseID,
                                    courseInstances: [req.params.courseInstanceID]
                                });
                            }
                            else {
                                acads.enrollments[0].courses[index].courseInstances.push(req.params.courseInstanceID);
                            }
                            await acads.save();
                            // var lol = await AcademicDetails.update({ "userID": "5ca60cb36c351e1d24015d3a" }, { "enrollments": { $elemMatch: { programID: req.params.programID } } }, {$set : { "enrollments[0].courses": jaipuli}})

                        }
                        acads = await AcademicDetails.findOne({ "userID": mentors[row.mentorEmail] }, { "enrollments": { $elemMatch: { programID: req.params.programID } } })

                        if (acadMenDetailsExists.length == 0 && acads) {
                            let acads = await AcademicDetails.findOne({ "userID": mentors[row.mentorEmail] }, { "enrollments": { $elemMatch: { programID: req.params.programID } } })
                            console.log(acads);
                            if (!acads.enrollments[0].courses) {
                                acads.enrollments[0].courses = []
                            }

                            let index = acads.enrollments[0].courses.findIndex(function (element) {
                                return element.courseID == req.params.courseID;
                            });
                            console.log(index);
                            if (index == -1) {
                                acads.enrollments[0].courses.push({
                                    courseID: req.params.courseID,
                                    courseInstances: [req.params.courseInstanceID]
                                });
                            }
                            else {
                                acads.enrollments[0].courses[index].courseInstances.push(req.params.courseInstanceID);
                            }
                            await acads.save();
                            // var lol = await AcademicDetails.update({ "userID": "5ca60cb36c351e1d24015d3a" }, { "enrollments": { $elemMatch: { programID: req.params.programID } } }, {$set : { "enrollments[0].courses": jaipuli}})

                        }
                    }
                    else {
                        row.Status = "Mentor not found"
                        data.invalidData.push(row);
                        errorFlag = true;
                    }
                }
                else {
                    row.Status = "Student not found";
                    data.invalidData.push(row);
                    errorFlag = true;
                }

                if (index == tasks.length - 1) {
                    if (errorFlag) data.result = false;
                    else data.result = true;
                    console.log(batch);
                    console.log(courseInstanceID);

                    await CourseInstances.update({ '_id': courseInstanceID }, { 'batches': batch });

                    res.send(data);
                }
            }
        });
});

router.get('/get-batches/:courseinstance/:mentor_id', jsonParser, async (req, res) => {
    let data = await CourseInstances.find({ _id: req.params.courseinstance });
    data = data[0];
    for (let index = 0; index < data.batches.length; index++) {

        if (data.batches[index].mentorID == req.params.mentor_id) {
            res.send(data.batches[index])
        }
    }
});

module.exports = router;
