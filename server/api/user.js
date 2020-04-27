const express = require('express');
const mongo = require('mongoose');
const user = express.Router();
const jwt = require('../jwt').jwt;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ limit: '100mb' });
const verifyOptions = require('../jwt').jwt.verifyOptions;
const publicKEY = require('../jwt').publicKEY;
const Users = require('../models/userModel');
const ObjectId = mongo.Types.ObjectId;
const assert = require('assert');
const winston = require('winston');
const Programs = require('../models/programModel');
const Acaddetails = require("../models/academicDetailsModel");
const fs = require('fs');
const path = require('path');

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

user.get('/', (req, res) => {
  res.send('Inside User');
});

user.get("/role", getRole);
user.get("/id", getId);
user.get('/details', getUser);

async function getUser(req, res) {
  try {
    console.log("Inside Get User "+req.query.id);
    assert(mongo.Types.ObjectId.isValid(req.query.id), "Invalid Object ID");
    const user = await Users.findOne({ "_id": new ObjectId(req.query.id) }).select({firstName:1,lastName:1,userID:1,image:1,role:1});
    // console.log(user);
    assert(user, "Not Found");
    logger.info('User details sent successfully');
    res.json(user);
  }
  catch (err) {
    // console.log("Error Get User -->",err.message);
    logger.error(`Error in getting user details --> ${err.message}`);
    res.status(404).json({ "error": err.message });
  }

}

async function getRole(req, res) {
  try {
    // console.log("Inside Get Role");
    var accessToken = req.query.token;
    // console.log(accessToken);
    var decoded = jwt.verify(accessToken, publicKEY, verifyOptions);
    // console.log("token verify--->", decoded);
    var user = await Users.findOne({ "email": decoded.email });
    assert(user, "Not Found");
    // console.log(user);
    // console.log(user.role);
    logger.info("User's role sent successfully");
    res.json({ "role": user.role });

  }
  catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      logger.error('Invalid token');
      res.status(404).end("Invalid Token");
    }

    logger.error("Error in getting user's role -->" + err.message);
    res.json({ "error": err.message });
  }
}


async function getId(req, res) {
  try {
    // console.log("Insise Get Role");
    var accessToken = req.query.token;
    // console.log(accessToken);
    var decoded = jwt.verify(accessToken, publicKEY, verifyOptions);
    // console.log("token verify--->", decoded);
    // console.log(await Users.find({"email":decoded.email}))
    var user = await Users.findOne({ "email": decoded.email });
    assert(user, "Not Found");
    logger.info("User's id sent successfully");
    res.json({ 'id': user._id });

  }
  catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      logger.error('Invalid token');
      res.status(404).end("Invalid Token");
    }
    logger.error("Error in getting user's id -->" + err.message);
    res.json({ "error": err.message });
  }
}

user.get("/get/student-list", async (req, res) => {
  try {
    var data = await Users.find({ role: "student" });
    console.log(data);
    res.send(data);
  } catch (error) {
    res.sendStatus(500);
  }
});



user.get("/get/user-list", async (req, res) => {
  try {
    var users = await Users.find({});
    users.map(user => {
      var path = process.env.UPLOADS_DIR + `${user.firstName}${user.lastName}.txt`;
      if (fs.existsSync(path)) {
        user.image = fs.readFileSync(path, 'utf-8');
      }else{
        user.image = ""
        console.log(`path not exist: ${path}`);
      }
    })
    res.send(users);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

user.get("/read/verify-admin/", jsonParser, async (req, res) => {

  try {
    var decoded = jwt.verify(req.query.token, publicKEY, verifyOptions);
    console.log(decoded);
    var userId = await Users.findOne({ "email": decoded.email });

    if (userId.role !== "admin") {
      res.send(403)
    }
    console.log(req.query.token);
    res.send(true);
  } catch (error) {
    res.sendStatus(500);
  }
});

user.get("/get/mentors", async (req, res) => {
  try {
    var data = await Users.find({ 'role': 'mentor' }, { email: 1, firstName: 1, lastName: 1 });
    console.log(data);
    res.send(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

user.post("/post/student-list/:role/:programID", jsonParser, async (req, res) => {
  try {

    role = req.params.role;
    if (role == "student") {
      var data = await Programs.update({ _id: req.params.programID }, { batch: req.body });
    }
    else {
      var data = await Programs.update({ _id: req.params.programID }, { mentors: req.body });
    }


    for (var i = 0; i < req.body.length; i++) {
      var details = await Acaddetails.findOne({ userID: req.body[i], "enrollments.programID": req.params.programID });
      var user = await Acaddetails.findOne({ userID: req.body[i] })
      console.log(details)

      if (details == null) {
        
        let progInfo = {
          programID: req.params.programID,
          courses: []
        }
        
        
        if (user) {
          console.log("yolo")
          user.enrollments.push(progInfo)
          var updatedData = await Acaddetails.update({userID:req.body[i]},{ enrollments: user.enrollments });
        }
        else {
       
          var acadStudent = { userID: req.body[i], enrollments: [{ programID: req.params.programID }] };
          await Acaddetails(acadStudent).save();
        }
      }

      if (i == req.body.length - 1) {
        res.send(true);
      }
    }


  } catch (error) {
    res.sendStatus(500);
  }
});


module.exports = user;
