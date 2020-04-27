import {
    Column as Property,
    Entity as Collection,
    ObjectIdColumn,
} from 'typeorm';
import { ObjectId } from "mongodb";

@Collection("coursecatalog")
export class Course {
    @ObjectIdColumn() readonly id: ObjectId;
    @Property() courseID: String;
    @Property() courseName: String;
    @Property() courseDescription: String;
    @Property() courseInstructor: ObjectId[];
    @Property() image?:{};
    @Property() isAlive: Boolean;
}