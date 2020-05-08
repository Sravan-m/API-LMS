import { getObjectId } from "mongo-seeding";
import { Course } from "../../models/course";

const csvFile = "../../csv/courses.tsv"

var csvjson = require('csvjson');
const fs = require('fs');
const path =  require('path');

const data = fs.readFileSync(path.join(__dirname, csvFile), { encoding: 'utf8' });
const options = {
    delimiter: '\t', // optional
};
const records = csvjson.toObject(data, options)

records.map(obj => {
    obj['id'] = getObjectId(obj['courseID']);
    obj['courseInstructor'] = [getObjectId(obj['courseInstructor'])];
    var isAlive = new Boolean();
    if (obj['isAlive'] == "true"){
        isAlive = true;
    } else {
        isAlive = false;
    }
    obj['isAlive'] = isAlive;
    return obj;
});

const course: Course[] = records;
export = course;