import { Column as Property } from "typeorm";
import { Program } from "./program";
import { CourseEnrollment } from "./course-enrollments";

export class Enrollment {
    @Property() programID: Program;
    @Property() courses: CourseEnrollment[]
}