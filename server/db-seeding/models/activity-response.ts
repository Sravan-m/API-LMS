import {
    Column as Property,
    Entity as Collection,
    ObjectIdColumn,
} from 'typeorm';
import { ObjectId } from "mongodb";
import { User } from './user';
import { Program } from './program';
import { Course } from './course';
import { CourseInstance } from './course-instance';

@Collection("activity-responses")
export class ActivityResponse {
    @ObjectIdColumn() readonly id: ObjectId;
    @Property() userID: User;
    @Property() activityType: String; // quiz or assignment
    @Property() programID: Program;
    @Property() courseID: Course;
    @Property() courseInstanceId: CourseInstance;
    @Property() moduleID: String;
    @Property() activityID: String;
    @Property() questionID: String;
    @Property() result: Boolean;
    @Property() timestamp: Date;
    @Property() evaluationStatus: Boolean;
    @Property() maxMarks: Number;
    @Property() awardedMarks: Number;
    @Property() feedback: String;
    @Property() evaluatedAt: Date;
    @Property() response: {};
}