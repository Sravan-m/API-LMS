import { User } from "../../models/user";
import { getObjectId } from "mongo-seeding";
import { Content } from "../../models/content";
const json = "../../csv/content.json"

const fs = require('fs');
const path =  require('path');

const data = fs.readFileSync(path.join(__dirname, json), { encoding: 'utf8' });
const obj = JSON.parse(data)
obj.id = getObjectId(obj.courseInstanceID);
const content: Content = obj;
export = content;