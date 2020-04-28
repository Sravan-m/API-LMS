const express = require('express');
const router = express.Router();
const user = require('./user');
const academicdetails = require('./academicdetails');
const activityresponse = require('./activityResponse');
const registration = require('./registration');
const content = require('./content');
const invites = require('./invites');
const course = require('./course');
const program = require('./program');
const courseInstance = require('./courseInstance')
const auth = require('./auth');
const fs = require('fs');
const path = require("path");
const jwt = require('../jwt').jwt;
const verifyOptions =  require('../jwt').jwt.verifyOptions;
const publicKEY = require('../jwt').publicKEY;

router.use(authenticateToken);
router.use('/user', user);
router.use('/academicdetails', academicdetails);
router.use('/activityresponse', activityresponse);
router.use('/registration', registration);
router.use('/content',content);
router.use('/invites', invites);
router.use('/course', course);
router.use('/program', program);
router.use('/course-instance', courseInstance);
router.use('/auth',auth);

function authenticateToken(req, res, next){
    try{
        if(req.url.startsWith('/auth') || req.url.startsWith('/invites') || req.url.startsWith('/registration') || req.url.startsWith('/user/read/verify-admin')) {
            next();
            return;
        }
        const accessToken = req.query.token;
        if(jwt.verify(accessToken, publicKEY, verifyOptions)){
            next();
            // res.status(200).send();
        }
        else{
            // console.log("Token Not Verified");
            res.status(401).send({"error":"Unauthorized User"});
        }
    }
    catch(err){
        if(err instanceof jwt.JsonWebTokenError){
            // console.log("Error at verifying token ",err);
            res.status(401).send({"error":"Invalid Token"});
        }
    }
}
// router.use('/activityresponse',require('../models/activityResponseModel'))

router.get('/', (req,res) =>{
    res.send('Inside API');
});

const prog_home = fs.readFileSync(path.resolve(__dirname, '../data/prog_home.json'));
const prog_home_data = JSON.parse(prog_home);

router.get('/home', (req, res) => {
    console.log("Inside Home API");
	// console.log(accessToken);
	try {
		res.status(200).send(prog_home_data);
	}
	catch (err) {
        console.log("Error at Home API",err);
		res.status(401).send()
	}
});

module.exports = router;
