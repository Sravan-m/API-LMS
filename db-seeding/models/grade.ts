import { Column as Property } from "typeorm";
import { CourseInstance } from "./course-instance";

export class Grade {
    @Property() grade: String;
    @Property() courseInstance: CourseInstance;
}