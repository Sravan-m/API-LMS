import { Column as Property } from 'typeorm';

export class Password {
    @Property() salt: String;
    @Property() hash: String;
}