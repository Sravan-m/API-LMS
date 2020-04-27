import { Column as Property } from "typeorm";
import { Course } from "./course";
import { CourseInstance } from "./course-instance";

export class CourseEnrollment {
    @Property() courseID: Course;
    @Property() courseInstances: CourseInstance[];
}