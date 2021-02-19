const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ limit: '100mb' });
const sah = require('../sah.js');
const fs = require('fs');
const jwt = require('../jwt').jwt;
const path = require("path");
const assert = require('assert');
const winston = require('winston');
const Users = require('../models/userModel');
const mailgunConfig = require('../mailgunConfig.js');
const Mailgun = require('mailgun-js');
const prog_home = fs.readFileSync(path.resolve(__dirname, '../data/prog_home.json'));
const prog_home_data = JSON.parse(prog_home);
const signOptions = {
  'algorithm': 'RS256'
};

const logger = winston.createLogger({
  level: 'info',
  // format: winston.format.json(),
  format:winston.format.combine(
    // winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'auth-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'info.log', level: 'info' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});


const privateKEY = require('../jwt').privateKEY;

const axios = require('axios');


router.post('/mauth', jsonParser, async (req, res) => {
  let data;
  let payload;
  let token;
  try{
    accessToken = req.body.accessToken;
    googleAuthAPI = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token="+ accessToken;

    axios.get(googleAuthAPI)
      .then(async response =>{
        if(response.data.email === req.body.email){
          userdata = await Users.findOne({email: req.body.email});
          assert(userdata, 'wrong email');
          payload = {
            'email': req.body.email,
          };
          token = jwt.sign(payload, privateKEY, signOptions);
          data = {
            'email': req.body.email,
            'token': token,
            'role': userdata.role
          };
          logger.info("User logged in successfully");
          res.status(200).send(data);
        } else {
          res.status(401).json({error: "Invalid user"});
        }
      })
      .catch(error => {
        res.status(401).json({error: "Invalid user"});
    });
  }
  catch(e){
    res.status(401).json({error: e.message});
  }
})

router.post('/login', jsonParser, async (req, res) => {
  let data;
  let payload;
  let token;
  try {
    data = await Users.findOne({email: req.body.email});
    // console.log("await after data -->",data);
    assert(data, 'wrong email');
    assert(data.password.hash === req.body.password, "wrong password");
    // assert(data.password.hash === sah.sha256(req.body.password, data.password.salt).hash, "wrong password");
    payload = {
      'email': req.body.email,
    };
    token = jwt.sign(payload, privateKEY, signOptions);
    data = {
      'token': token,
      'valid': data.role
    };
    logger.info("User logged in successfully");
    res.send(data);
  } catch (e) {
    logger.error("User not able to log in due to " + e.message);
    res.status(401).json({error: e.message});
  }
});


router.post('/forgot-password', jsonParser, async (req, res) => {
	// console.log(req.body);
	try {
		token = sah.genRandomString(16);
		let user = await Users.findOne({ email: req.body.email });
		await Users.update({ email: user.email }, { $set: { "resetToken": token } }, { upsert: false, multi: true });
		var mailgun = new Mailgun({ apiKey: mailgunConfig.api_key, domain: mailgunConfig.domain });
		// let url = 'http://localhost:4200/auth/reset-password/' + token
		var data = {
			from: mailgunConfig.to_who,
			// to: 'akhil.dh2@gmail.com',
			to: user.email,
			subject: 'LMS Password Reset',
			text: 'Hey,\nPlease click on the following link to reset your password.\n\nhttps://calm-dawn-53560.herokuapp.com/auth/reset-password/'+token
			// html: "<a href=" + url + "> Reset</a>"
		};
		mailgun.messages().send(data, (err, body) => {
			if (err) console.log(err);
			else console.log('Reset password mail sent successfully.');
			res.send(true)
		});
	}
	catch (e) {
		res.status(401).end();
	}
});

//api
router.post('/reset-password', jsonParser, async (req, res) => {
	console.log(req.body);
	// if (req.body.validate == "") res.status(401).end()
	try {
		let pass = sah.saltHashPassword(req.body.password);
		await Users.findOne({ resetToken: req.body.validate });
		await Users.update({ resetToken: req.body.validate }, { $set: { resetToken: "", password: pass } }, { upsert: false, multi: true });
		res.send(true);
	}
	catch (e) {
		res.status(401).end();
	}
});

module.exports = router;
