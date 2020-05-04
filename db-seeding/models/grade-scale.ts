import { Column as Property } from "typeorm";

export class GradeScale {
    @Property() grade: String;
    @Property() points: Number;
}