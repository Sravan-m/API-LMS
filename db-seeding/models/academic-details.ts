import {
    Column as Property,
    Entity as Collection,
    ObjectIdColumn,
} from 'typeorm';
import { User } from "./user";
import { Enrollment } from "./enrollment";

@Collection("academicdetails")
export class AcademicDetails {
    @Property() userID: User;
    @Property() enrollments: Enrollment[];
}