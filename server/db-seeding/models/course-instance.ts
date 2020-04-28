import { 
	Column as Property,
	Entity as Collection,
	ObjectIdColumn
} from 'typeorm';

import { User } from './user';
import { Batch } from './batch';
import { ObjectId } from "mongodb"

@Collection("courseinstances")
export class CourseInstance  {
	@ObjectIdColumn() readonly id: ObjectId;		//	added a new property.
    @Property() courseInstanceLabel: String;
    @Property() courseIncharge: User[];             //  For consistency we are trying to upload as Strings
    @Property() isLive: Boolean;
    @Property() enrollment: User[];                 //  For consistency enrollments are empty arrays
    @Property() batches: Batch[];
    @Property() numberofCredits: Number;
    @Property() isCourseRequired: Boolean;
}