import { Column as Property } from "typeorm";
import { User } from "./user";

export class Batch {
    @Property() mentorID: User;			//	For consistency, mentorID is uploaded as String
    @Property() studentsID: User[];
}