import { Column as Property } from 'typeorm';

export class Password {
    @Property() salt: string;
    @Property() hash: string;
}