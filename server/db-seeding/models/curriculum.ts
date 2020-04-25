import { Column as Property } from 'typeorm';

export class Curriculum  {
    @Property() courseID: String;
    @Property() courseInstances: []
}