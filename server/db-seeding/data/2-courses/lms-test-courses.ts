import { Course } from "../../models/course";
import { getObjectId } from "mongo-seeding";

const csvFile = "../../csv/courses.tsv"

var csvjson = require('csvjson');
const fs = require('fs');
const path =  require('path');

const data = fs.readFileSync(path.join(__dirname, csvFile), { encoding: 'utf8' });
const options = {
    delimiter: '\t', // optional
};
const records = csvjson.toObject(data, options)

function get_id(array) {
	return array.map(x => getObjectId(x.toString()))
}

records.map(obj => {
    obj['id'] = getObjectId(obj['courseID']);

    obj['isAlive'] = eval(obj['isAlive']);
    obj['courseInstructor'] = get_id(eval(obj['courseInstructor']));
    return obj;
});

const courses: Course[] = records;
export = courses;