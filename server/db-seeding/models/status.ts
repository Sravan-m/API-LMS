import { Column as Property } from "typeorm";
import { CourseInstance } from "./course-instance";

export class Status {
    @Property() status: String;
    @Property() courseInstance: CourseInstance;
}