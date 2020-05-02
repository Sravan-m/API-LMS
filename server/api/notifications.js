const express = require('express');
const router = express.Router();
const mongo = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ limit: '100mb' });
const notificationsModel = require('../models/notificationModel');

router.post("/subscribetonotification", jsonParser, async (req, res) => {
    try {
        console.log(req.body);
        var data = req.body;
        const notification = await notificationsModel.findOne({email: data.email});
        console.log(notification);
        if (notification) {
            console.log("Here...2");
            await notificationsModel.update({ "email": data.email}, {$set:{"expoToken":data.expoToken}} );
            res.status(200).send("updated");
        } else {
            console.log("Here...1");
            await notificationsModel(data).save();
            res.status(200).send("inserted");
        }
    } catch(error) {
        res.send(error)
    }
});

module.exports = router;