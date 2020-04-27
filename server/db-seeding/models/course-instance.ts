import { Column as Property } from 'typeorm';
import { User } from './user';
import { Batch } from './batch';

export class CourseInstance  {
	@ObjectIdColumn() readonly id: ObjectId;		//	added a new property.
	@Property() courseInstanceID: String;			//	added a new field.
    @Property() courseInstanceLabel: String;
    @Property() courseIncharge: User[];
    @Property() isLive: Boolean;
    @Property() enrollment: User[];
    @Property() batches: Batch[];
    @Property() numberofCredits: Number;
    @Property() isCourseRequired: Boolean;
}