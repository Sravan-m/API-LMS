import {
    Column as Property,
    Entity as Collection,
    ObjectIdColumn,
} from 'typeorm';
import { ObjectId } from "mongodb";
import { Password } from './password';

@Collection('users')
export class User {
    @ObjectIdColumn() readonly id: ObjectId;
    @Property() firstName: String;
    @Property() lastName: String;
    @Property() userID: String;
    @Property() email: String;
    @Property() password: Password;
    @Property() phoneNo: String;
    @Property() dateOfBirth: Date;
    @Property() gender: String;
    @Property() image: String;
    @Property() resetToken?: String;
    @Property() role: String;
}