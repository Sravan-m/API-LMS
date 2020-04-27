import { Column as Property } from "typeorm";
import { CourseInstance } from "./course-instance";

export class Content {
    @Property() courseInstanceID: CourseInstance;
    @Property() contentJSON: {};
}