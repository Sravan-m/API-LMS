import {
    Column as Property,
    Entity as Collection,
    ObjectIdColumn,
} from 'typeorm';
import { ObjectId } from "mongodb";
import { User } from "./user";

@Collection("coursecatalog")
export class Course {
    @ObjectIdColumn() readonly id: ObjectId;
    @Property() courseID: String;
    @Property() courseName: String;
    @Property() courseDescription: String;
    @Property() courseInstructor: User[];
    @Property() image:{};
    @Property() isAlive: Boolean;
}