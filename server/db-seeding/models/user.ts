import {
    Column as Property,
    Entity as Collection,
    ObjectIdColumn,
} from 'typeorm';
import { ObjectId } from "mongodb";
import { Password } from './password';

@Collection('users')
export class User {
    @ObjectIdColumn() id: ObjectId;
    @Property() firstName: string;
    @Property() lastName: string;
    @Property() userID: string;
    @Property() email: string;
    @Property() password: Password;
    @Property() phoneNo: string;
    @Property() dateOfBirth: Date;
    @Property() gender: string;
    @Property() image: string;
    @Property() resetToken?: string;
    @Property() role: string;
}