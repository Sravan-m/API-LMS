import { 
    Column as Property,
    Entity as Collection,
    ObjectIdColumn
 } from "typeorm";
 import { ObjectId } from "mongodb";
import { CourseInstance } from "./course-instance";

@Collection("contents")
export class Content {
    @ObjectIdColumn() readonly id: ObjectId;
    @Property() courseInstanceID: CourseInstance;
    @Property() contentJSON: Object[];
}