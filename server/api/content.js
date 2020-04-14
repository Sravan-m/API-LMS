const express = require('express');
const contentRouter = express.Router();
const fs = require('fs');
var Git = require("nodegit");
var rimraf = require("rimraf");
const mongo = require('mongoose');
const Content = require("../models/contentModel");
const { lstatSync, readdirSync, readFileSync, writeFile, rmdir, unlink } = require('fs');
const { join } = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ limit: '100mb' });

contentRouter.get("/lessons/:course_id", getLessonsByCourseId);
contentRouter.get("/activities/:lesson_id", getActivitiesByLessonId); // old api from getting data from server folder
contentRouter.post("/post/content-json", jsonParser, postContentJSON);
contentRouter.get("/get/content-json/:courseInstanceID", getContentJSON);
contentRouter.get("/get/activities/:courseInstanceID/:lessonID", getActivities);

function getLessonsByCourseId(req, res) {
	var course_id = req.params.course_id;
	// console.log("course id ", course_id);
	// Check if the file exists in the current directory, and if it is writable.
	var file = './data/' + course_id + '.json';
	fs.access(file, fs.constants.F_OK | fs.constants.R_OK, (err) => {
		if (err) {
			console.error(
				`${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is not readable'}`);
			res.send([])
		} else {
			// console.log(`${file} exists, and it is readable`);
			fs.readFile(file, 'utf8', (err, data) => {
				if (err) console.log("error while reading file", err);
				// console.log(data);
				res.send(JSON.parse(data));
			});
		}
	});
}

async function getActivities(req, res) {
	try {
		var courseInstanceID = req.params.courseInstanceID;
		var lessonID = req.params.lessonID;
		console.log("courseInstanceID => ", courseInstanceID);

		var queryResults = await Content.findOne({ "courseInstanceID": courseInstanceID });
		console.log("queryResults => " + queryResults);

		var contentJSON = queryResults.contentJSON.filter(d => d.module_id == lessonID);
		console.log(contentJSON);
		res.send(contentJSON[0].content);
	}
	catch (err) {
		console.log('Error in Getting Activities', err);
		res.send({ 'error': 'not found' });
	}
}

function getActivitiesByLessonId(req, res) {
	var lesson_id = req.params.lesson_id;
	// console.log("course id ", lesson_id);
	// Check if the file exists in the current directory, and if it is writable.
	var file = './data/lessons/' + lesson_id + '.json';
	fs.access(file, fs.constants.F_OK | fs.constants.R_OK, (err) => {
		if (err) {
			console.error(
				`${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is not readable'}`);
			res.send([])
		} else {
			// console.log(`${file} exists, and it is readable`);
			fs.readFile(file, 'utf8', (err, data) => {
				if (err) console.log("error while reading file", err);
				// console.log(data);
				res.send(JSON.parse(data));
			});
		}
	});
}

//New content getting API starts here.
async function getContent(repoLink, commitId) {
	console.log(repoLink);
	rimraf.sync("./temp");
	try {
		await Git.Clone(repoLink, "./temp");
		repo = await Git.Repository.open('./temp');
	}
	catch(e) {
		rimraf.sync("./temp");
		throw new Error('wrong repo link or token');
		
	}
	// console.log("yolo");
	try{
		commit = await repo.getCommit(Git.Oid.fromString(commitId))
		await Git.Reset.reset(repo, commit, Git.Reset.TYPE.SOFT);
	}
	catch(e) {
		repo.cleanup();
		console.time('rimraf');
		throw new Error('wrong commit id');
	}
	var folder = 'temp';
	var files = readdirSync('./' + folder).filter(file => file.endsWith('.json'));
	console.log(files)
	var course = files[0].split('.')[0];
	var lessons = JSON.parse(readFileSync(`./${folder}/${course}.json`, 'utf8'));
	console.log(lessons)
	lessons.forEach(lesson => {
		try {
			lesson['content'] = JSON.parse(readFileSync(`./${folder}/lessons/${lesson['module_id']}.json`, 'utf8'));
		}
		catch (e) {
			lesson['content'] = null;
		}
	});
	repo.cleanup();
	console.time('rimraf');
	rimraf.sync("./temp");
	console.log("batman");
	// console.timeEnd('rimraf');
	return lessons;
}

async function postContentJSON(req, res) {
	var courseInstanceID = req.body.courseInstanceID;
	var repoLink = req.body.repoLink;
	var commitID = req.body.commitID;
	var token = req.body.pat;
	var regexp = /https\:\/\/github\.com\/(.*)\/(.*)\.git/;
	var match = regexp.exec(repoLink);
	console.log(match);
	try {
		var userName = match[1];
		var repoName = match[2];
	}
	catch(e) {
		// console.log(e.message);
		res.status(500).send("wrong repo link");
	}	
	repoLink = `https://${token}:x-oauth-basic@github.com/${userName}/${repoName}.git`
	console.log(repoLink)
	console.log(repoLink);
	console.log(commitID);
	console.log(courseInstanceID);
	try {
		data = await getContent(repoLink, commitID);
		if (updateContentJSON(courseInstanceID, data)) res.status(200).send({status: "success"});
		
	}
	catch(e) {
		console.log("Sup");
		console.log(e.message);
		res.status(500).send(e.message);
	}
}

async function getContentJSON(req, res) {
	var courseInstanceID = req.params.courseInstanceID;
	var data = await Content.findOne({ "courseInstanceID": courseInstanceID })
	res.send(data);
}

async function updateContentJSON(courseInstanceID, contentdata) {
	console.log(courseInstanceID)
	var data = await Content.findOne({ courseInstanceID: courseInstanceID }, { courseInstanceID: 1 })
	let dbData = { courseInstanceID: courseInstanceID, contentJSON: contentdata }

	if (data != null) {
		var updateddata = await Content.update({ courseInstanceID: courseInstanceID }, { contentJSON: contentdata })
	}
	else {
		// console.log("yolo")
		Content(dbData).save();
	}
	return true;
}



module.exports = contentRouter;
