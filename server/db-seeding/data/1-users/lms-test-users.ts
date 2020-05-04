import { User } from "../../models/user";
import { Password } from "../../models/password";
import { getObjectId } from "mongo-seeding";

const csvFile = "../../csv/users.tsv"

var csvjson = require('csvjson');
const fs = require('fs');
const path =  require('path');

const data = fs.readFileSync(path.join(__dirname, csvFile), { encoding: 'utf8' });
const options = {
    delimiter: '\t', // optional
};
const records = csvjson.toObject(data, options)

records.map(obj => {
    obj['id'] = getObjectId(obj['userID']);
    obj['dateOfBirth'] = new Date(obj['dateOfBirth']);
    const pwd = new Password();
    pwd.hash = obj['password'];
    obj['password'] = pwd;
    return obj;
});

const users: User[] = records;
export = users;