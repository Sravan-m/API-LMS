import { Program } from "../../models/program";
import { GradeScale } from "../../models/grade-scale";
import { Curriculum } from "../../models/curriculum";

import { getObjectId } from "mongo-seeding";

const csvFile = "../../csv/program.tsv"

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
	return array.map(x => getObjectId(x.toString()));
}

function get_curriculum(array) {
    let curriculum: Curriculum[] = new Array(array.length);
    for (var i = 0; i < array.length; i++) {
        let curr = new Curriculum();
        curr.courseID = getObjectId(array[i][0].toString());
        curr.courseInstances = get_id(array[i][1]);
        curriculum[i] = curr;
    }
    return curriculum;
}

function get_gradeScale(array) {
	let gradeScales: GradeScale[] = new Array(array.length);
    for (var i = 0; i < array.length; i++) {
        let gradeScale = new GradeScale();
        gradeScale.grade = array[i][0];
        gradeScale.points = array[i][1];
        gradeScales[i] = gradeScale;
    }
	return gradeScales;
}

records.map(obj => {
    obj['id'] = getObjectId(obj['programName']);
    obj['batch'] = get_id_as_string(eval(obj['batch']));
    obj['mentors'] = get_id_as_string(eval(obj['mentors']));
    obj['curriculum'] = get_curriculum(eval(obj['curriculum']));
    obj['gradeScale'] = get_gradeScale(eval(obj['gradeScale']));
    return obj;
});

const programs: Program[] = records;
export = programs;