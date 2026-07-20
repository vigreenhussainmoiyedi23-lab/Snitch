import userModel, { type userSchemaType } from "../models/user.model.js";

export const createUser = async (data: Partial<userSchemaType>) => {
  const user = await userModel.create(data);
  return user;
};
