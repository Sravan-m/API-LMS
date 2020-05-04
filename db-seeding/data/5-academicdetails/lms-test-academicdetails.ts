import { AcademicDetails } from "../../models/academic-details";
import { Program } from "../../models/program";
import { Grade } from "../../models/grade";
import { Status } from "../../models/status";
import { CourseEnrollment } from "../../models/course-enrollments";
import { Course } from "../../models/course";
import { CourseInstance } from "../../models/course-instance";
import { Enrollment } from "../../models/enrollment";
import { Curriculum } from "../../models/curriculum";
import { getObjectId } from "mongo-seeding";

const jsonFile = "../../csv/academicdetails.json"

const fs = require('fs');
const path =  require('path');

const data = fs.readFileSync(path.join(__dirname, jsonFile), { encoding: 'utf8' });
const records = JSON.parse(data);

function get_id_as_string(array) {
    return array.map(x => getObjectId(x.toString()).toString())
}

function get_id(array) {
    return array.map(x => getObjectId(x.toString()));
}

function get_status(objStatus) {
    const status: Status[] = new Array(objStatus.length);
    for (let i = 0; i < objStatus.length; i++) {
        const s = new Status();
        s.status = objStatus[i].status;
        s.courseInstance = getObjectId(objStatus[i].courseInstance);
        status[i] = s;
    }
    return status;
}

function get_grades(objGrades) {
    const grades: Grade[] = new Array(objGrades.length);
    for (let i = 0; i < objGrades.length; i++) {
        const g = new Grade();
        g.grade = objGrades[i].grade;
        g.courseInstance = getObjectId(objGrades[i].courseInstance);
        grades[i] = g;
    }
    return grades;
}

function get_course_enrollments(objCourses) {
    const courses: CourseEnrollment[] = new Array(objCourses.length);
    console.log(objCourses);
    for (let i = 0; i < objCourses.length; i++) {
        let ce = new CourseEnrollment();
        ce.courseID = getObjectId(objCourses[i].courseID);
        console.log("Here....2");
        ce.courseInstances = get_id(objCourses[i].courseInstances);
        console.log(ce.courseInstances);
        ce.grades = get_grades(objCourses[i].grades);
        ce.status = get_status(objCourses[i].status);
        courses[i] = ce;
    }
    return courses;
}

function get_enrollments(objEnrollments) {
    console.log(objEnrollments);
    const enrollments: Enrollment[] = new Array(objEnrollments.length);
    for (let i = 0; i < objEnrollments.length; i++) {
        let enrollment = new Enrollment();
        enrollment.programID = getObjectId(objEnrollments[i].programID);
        console.log("Here....1.1");
        enrollment.courses = get_course_enrollments(objEnrollments[i].courses);
        console.log("Here....1.2");
        enrollments[i] = enrollment;
    }
    return enrollments;
}

records.map(obj => {
    obj['userID'] = getObjectId(obj.userID);
    obj['enrollments'] = get_enrollments(obj['enrollments']);
    return obj;
});

const academicdetails: AcademicDetails[] = records;
export = academicdetails;