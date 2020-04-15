const express = require('express');
const router = express.Router();
const mongo = require('mongoose');
const bodyParser = require('body-parser');
const Users = require('../models/userModel');
const jsonParser = bodyParser.json({ limit: '100mb' });
const Courses = require('../models/courseModel');
const Programs = require('../models/programModel');
const acadDetails = require("../models/academicDetailsModel")
// mongo.model('Users', Users);
var ObjectId = mongo.Types.ObjectId;
router.get("/get/all-programs", async (req, res) => {
    try {
        var data = await Programs.find({});
        console.log(data);
        res.send(data);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.get("/courses/get", async (req, res) => {
    try {
        var data = await Courses.find({}, { courseName: 1 });
        console.log(data);
        res.send(data);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.post("/create", jsonParser, (req, res) => {
    try{
    console.log(req.body);
    var data = req.body;
    Programs(data).save();
    res.send(true);}
    catch(err){
        res.send(err)
    }
});

router.post("/update/:program_id", jsonParser, async (req, res) => {
    try{
    var code = req.params.program_id;
    var data = req.body;
    var program1 = await Programs.find({_id:code});
    let curriculum=[];
    var flag=true;
    var flag2=false;
    for(let x=0;x<program1[0].curriculum.length;x++){
        curriculum.push(program1[0].curriculum[x])
    }
    for(let index=0;index<data.length;index++){
         flag=true;
        for(let j=0;j<program1[0].curriculum.length;j++){
            if(data[index]._id==program1[0].curriculum[j]._id){
                flag=false;               
            }   
        }
        flag2=true;
        if(flag){
            temp={
                CourseInstances:[],
                _id:data[index]._id
            }
            curriculum.push(temp)
        }
        
    }
    console.log(curriculum)
    console.log(program1);
    await Programs.update({ "_id": code}, {$set:{"curriculum":curriculum}} );
    
    res.send(true);}
    catch(err){
        res.send(err)
    }
});

router.get("/get/curriculum/:program_id", async (req, res) => {
    try {
        var data = await Programs.find({  _id: req.params.program_id});
        // console.log(data)
        // console.log(data[0].curriculum.length)
        let coursesNames=[];
        for (let index = 0; index < data[0].curriculum.length; index++) {
            const courseID = data[0].curriculum[index]._id
            console.log(index)
            console.log(courseID)
            var data1 = await Courses.find({ _id: courseID }, { courseName: 1 });
            coursesNames.push(data1[0]);
            
            if (data[0].curriculum.length - 1 == index) {
                console.log(coursesNames);
                res.send(coursesNames);
            }
        }
        
    } catch (error) {
        res.sendStatus(500);
    }
});

router.get("/get/enrolled_programs/:userID", async (req, res) => {
    try {
        var id = req.params.userID;
        console.log(id);
        var query = {
            "userID": new ObjectId(id)
        };
        console.log(query);
        
        
        var data = await acadDetails.find(query,{"enrollments.program_id":1}).populate({path: "enrollments.programID",model: 'Programs',select:'programName programDescription'})
        // .populate({path: "enrollments.courses.courseID",model: 'CourseCatalog'}).populate({path: "enrollments.courses.courseInstances",model: 'CourseInstances'});
        console.log(data);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/get/program-name/:programID",  async (req, res) =>{
    try{
        var query = {_id: req.params.programID};
        console.log("Inside  program-name");
        console.log(query);
        
        var queryResult = await Programs.findOne(query);
        console.log(queryResult);
        res.send({"programName":queryResult.programName});
    }
    catch(error){
        console.log("Error at getting program-name");
        console.log(error);
        res.sendStatus(500);
    }
});


module.exports = router;