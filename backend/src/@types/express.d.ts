import { HydratedDocument } from "mongoose";
import { userSchemaType } from "../models/user.model.js";

declare global {
  namespace Express {
    interface User extends HydratedDocument<userSchemaType> {}
  }
}

export {};