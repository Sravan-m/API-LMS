import { Column as Property } from "typeorm";
import { User } from "./user";

export class Batch {
    @Property() mentorID: User;
    @Property() studentsID: User[];
}