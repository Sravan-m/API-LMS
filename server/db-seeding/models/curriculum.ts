import { Column as Property } from 'typeorm';

export class Curriculum  {
    @Property() courseID: String;		// This will be referred as _id in the MongoDB.
    @Property() courseInstances: []		// Object IDs will be uploaded.
}