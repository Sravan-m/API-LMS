import { csv2json } from "../../helpers";
import { User } from "../../models/user";

const csvFile = "path"

const users: User[] = csv2json(csvFile);

export = users;