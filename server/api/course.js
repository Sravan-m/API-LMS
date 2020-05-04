const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongo = require('mongoose');
const fs=require("fs")
var ObjectId = mongo.Types.ObjectId;
const acadDetails=require("../models/academicDetailsModel")

const jsonParser = bodyParser.json({ limit: '100mb' });
const Courses = require('../models/courseModel');
var multer  = require('multer')
var upload = multer({ dest: process.env.UPLOADS_DIR })

router.post("/create", upload.single('image'), (req, res) => {
    try {
        var img=fs.readFileSync(req.file.path)
        console.log(img)
        var encode_image = img.toString('base64');
        var finalImg = {
            contentType: req.file.mimetype,
            image:  new Buffer(encode_image, 'base64')
        };
        data = req.body;
        data.image=finalImg
        data.isAlive = true;
        Courses(data).save();   
        res.send(true);
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});


router.post("/get/course-names", jsonParser, async (req, res) => {
    try {
        
        var coursesIDArray = req.body;
        var coursesNames = [];
        for (let index = 0; index < coursesIDArray.length; index++) {
            const courseID = coursesIDArray[index];
            
            var data = await Courses.find({ _id: courseID._id }, { courseName: 1 });
            coursesNames.push(data[0]);
           
            if (coursesIDArray.length - 1 == index) {
                res.send(coursesNames);
            }
        }
    } catch (error) {
        res.sendStatus(500);
    }
});

router.get("/get/catalog", async (req, res) => {
    try {
        var data = await Courses.find({});
        console.log(data);
        res.send(data);
    } catch (error) {
        res.sendStatus(500);
    }
});


router.get("/get/courseinfo/:user_id/:program_id", async (req, res) => {
    try {
        // console.log("yolo")
        var program_id=req.params.program_id;
        var user=req.params.user_id;
        console.log(user)
        console.log(ObjectId(user))

        var query = {
            "userID": new ObjectId(user)
        };
        console.log(ObjectId(user))
        var query2={
            "programID":new ObjectId(program_id)
        }
        console.log(query)
        console.log(query2)
        var data=await acadDetails.findOne(query,{"enrollments":{ $elemMatch:query2 }}).populate({
            path: "enrollments.courses.courseID",
            model: 'CourseCatalog'
        }).populate({
            path: "enrollments.courses.courseInstances",
            select:{_id:1,courseInstanceLabel:1,isLive:1,courseIncharge:1,courseInstructor:1},
            model: 'CourseInstances'
        }).populate({
            path: "enrollments.programID",
            select: { _id: 1, programDescription:1,programName:1}
        });
        console.log(data)
        //res.send(data);
        res.send(data.enrollments[0]);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.post("/update/catalog", jsonParser, async (req, res) => {
    try {

        console.log(req.body);

        data = req.body;
        data.forEach(async (element) => {
            let temp = await Courses.findOne({ '_id': element._id })
            if (temp && element._id) {
                console.log(element)
                await Courses.update({ '_id': element._id }, { $set: { "courseID": element.courseID, "courseName": element.courseName, "courseDescription": element.courseDescription, "isAlive": element.isAlive } });
            }
            else {
                await delete element._id
                console.log(element)
                await Courses(element).save()
            }
        });
        res.send(true);
    } catch (error) {
        res.sendStatus(500);
    }
});

// router.get('/get/course-instances/:user_id', async(req, res) => {
//     try {
//         // console.log('dd');
//         var user = req.params.user_id;

//         var query = {
//             "userID": new ObjectId(user)
//         };

//         var data = await acadDetails.findOne(query);
//         data = data.enrollments;
//         data = data.map(x => x.map(y => y.courseInstances));
//         console.log(data)
//         //res.send(data);
//         res.send(data);
//     } catch (error) {
//         res.sendStatus(500);
//     }
// })
module.exports = router;
