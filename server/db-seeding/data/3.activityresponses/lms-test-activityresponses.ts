import { User } from "../../models/user";
import { getObjectId } from "mongo-seeding";

const csvFile = "../../csv/activityresponse.tsv"

var csvjson = require('csvjson');
const fs = require('fs');
const path =  require('path');

const data = fs.readFileSync(path.join(__dirname, csvFile), { encoding: 'utf8' });
const options = {
    delimiter: '\t', // optional
};
const records = csvjson.toObject(data, options)

records.map(obj => {
    obj['userId'] = getObjectId(obj['userId']);
    obj['programId'] = getObjectId(obj['programId']);
    obj['courseInstanceId'] = getObjectId(obj['courseInstanceId']);
    obj['courseId'] = getObjectId(obj['courseId']);
    obj['timestamp'] = new Date(obj['timestamp']);
    var evaluationStatus = new Boolean();
    if (obj['evaluationStatus'] == "TRUE"){
        evaluationStatus = true;
        obj['evaluatedAt'] = new Date(obj['evaluatedAt']);
    } else {
        evaluationStatus = false;
        delete obj['evaluatedAt'];
    }
    obj['response'] = {"assignment" : obj["response"]};
    obj["maxMarks"] = Number(obj["maxMarks"]);
    obj["awardedMarks"] = Number(obj["awardedMarks"]);
    obj['evaluationStatus'] = evaluationStatus;
    return obj;
});

const activityresponses: User[] = records;
export = activityresponses;