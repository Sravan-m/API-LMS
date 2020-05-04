import { Column as Property } from "typeorm";
import { Grade } from "./grade";
import { Course } from "./course";
import { Status } from "./status";

import { CourseInstance } from "./course-instance";

export class CourseEnrollment {
    @Property() courseID: Course;
    @Property() courseInstances: CourseInstance[];
    @Property() grades: Grade[];
    @Property() status: Status[];
}
