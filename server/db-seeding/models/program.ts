import { 
    Column as Property,
    Entity as Collection,
    ObjectIdColumn
 } from 'typeorm';
import { ObjectId } from "mongodb";
import { Curriculum } from './curriculum';
import { Batch } from './batch';
import { User } from './user';
import { GradeScale } from './grade-scale';

@Collection("programs")
export class Program {
    @ObjectIdColumn() readonly id: ObjectId;
    @Property() programName: String;
    @Property() curriculum: Curriculum[];
    @Property() batch: User[];                  //  For consistency we are trying to upload as Strings
    @Property() mentors: User[];                //  For consistency we are trying to upload as Strings
    @Property() programDescription: String;
    @Property() calendar: String;
    @Property() gradeScale: GradeScale[];
}