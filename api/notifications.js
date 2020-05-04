const express = require('express');
const router = express.Router();
const mongo = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ limit: '100mb' });
const notificationsModel = require('../models/notificationModel');


let { Expo } = require("expo-server-sdk");
let expo = new Expo();

router.post("/subscribetonotification", jsonParser, async (req, res) => {
    try {
        var data = req.body;
        const notification = await notificationsModel.findOne({email: data.email});
        if (notification) {
            await notificationsModel.update({ "email": data.email}, {$set:{"expoToken":data.expoToken}} );
            res.status(200).send("updated");
        } else {
            await notificationsModel(data).save();
            res.status(200).send("inserted");
        }
    } catch(error) {
        res.send(error)
    }
});

router.post("/sendnotification", jsonParser, async (req, res) => {
    const data = req.body;
    const records = await notificationsModel.find();
    let tokens = [];
    for (let i = 0; i < records.length; i++) {
        tokens.push(records[i].expoToken);
    }
    var message = {
        to:tokens,
        body: req.body.body,
        title : req.body.title,
        img_url: req.body.img_url,
        sound: "default",
        badge:"5",
        image: "http://msitprogram.net/images/logo.png",        
        data: {
            type: 1,
            body: req.body.body,
            title : req.body.title,
            img_url: req.body.img_url,
            image: "http://msitprogram.net/images/logo.png",
        }
    };

    let messages = [];
    messages.push(message);
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(ticketChunk);
        }
        catch (error) {
            console.error(error);
        }
    }
    console.log(tickets);
    res.send(tickets);
});

module.exports = router;