import { CourseInstance } from "../../models/course-instance";
import { Batch } from "../../models/batch";

import { getObjectId } from "mongo-seeding";

const csvFile = "../../csv/courseInstance.tsv"

var csvjson = require('csvjson');
const fs = require('fs');
const path =  require('path');

const data = fs.readFileSync(path.join(__dirname, csvFile), { encoding: 'utf8' });
const options = {
    delimiter: '\t', // optional
};
const records = csvjson.toObject(data, options)

function get_id_as_string(array) {
    return array.map(x => getObjectId(x.toString()).toString())
}

function get_id(array) {
	return array.map(x => getObjectId(x.toString()))
}

function get_batches(array) {
	let batches: Batch[] = new Array(array.length);
	for (var i = 0; i < array.length; i++) {
        const batch = new Batch();
		batch.mentorID = getObjectId(array[i][0].toString()).toString();
        batch.studentsID = get_id(array[i][1]);
        batches[i] = batch;
    }
	return batches;
}

records.map(obj => {
    obj['id'] = getObjectId(obj['courseInstanceID']);
    obj['courseIncharge'] = get_id_as_string(eval(obj['courseIncharge']));
    obj['isLive'] = eval(obj['isLive']);
    obj['enrollment'] = get_id(eval(obj['enrollment']));
    obj['batches'] = get_batches(eval(obj['batches']));
    obj['isCourseRequired'] = eval(obj['isCourseRequired']);
    obj['numberOfCredits'] = eval(obj['numberOfCredits'].toString());
    delete obj['courseInstanceID'];
    return obj;
});

const courseInstances: CourseInstance[] = records;
export = courseInstances;