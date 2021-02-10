import { Document, model, Schema } from "mongoose";
import { User } from "../types";

const schema = new Schema({
  username: { type: String },
  password: { type: String },
});

export default model<User & Document<any>>("User", schema);
