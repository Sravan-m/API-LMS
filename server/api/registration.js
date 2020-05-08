const express = require('express');
const registration = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ limit: '100mb' });
const fs = require('fs');
const sah = require('../sah');
const Users = require('../models/userModel');


registration.get('/', (req,res) => {
    res.send('Inside invite');
});

registration.post("/sendotp", jsonParser, postSendOTP);
registration.post("/verifyotp", jsonParser, postVerifyOTP);
registration.post("/register", jsonParser, postRegister);

function postRegister(req, res) {

	try{
		var path1 = process.env.UPLOADS_DIR;
		// console.log(req.body);
		fs.writeFile(path1 + req.body.firstName + req.body.lastName + '.txt', req.body.image, function (err, data) {
			if (err) console.log(err);
			console.log("Successfully Written to File.");
		});
		req.body['image'] = path1 + req.body.firstName + "_" + req.body.lastName + '.txt';
		req.body['password'] = sah.saltHashPassword(req.body['password'])
		userObj = new Users(req.body);
		userObj.save().then(() => console.log('saved'));
	}
	catch(err){
		console.log("Error in Storing the registration details", err);
		res.status(404).json({"error":"Error in Storing the registration details"});
	}

}

function postVerifyOTP (req, res) {
	tOTP = req.body.otp;
	if (OTP == tOTP) res.send('true');
	else res.send('false');
}


function postSendOTP(req, res) {
	// console.log(req.body)
	var phone = req.body.phoneNo;
	// console.log(phone);
	var digits = '0123456789';
	OTP = '';
	for (let i = 0; i < 4; i++) {
		OTP += digits[Math.floor(Math.random() * 10)];
	}
	// console.log(OTP)
	OTP = "1234";
	res.send(OTP);
}




module.exports = registration;
