import { model, Schema, Document } from "mongoose";
import { Comment } from "../types";

const schema = new Schema({
  content: {
    type: String,
  },
  parent: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "parentType",
  },
  parentType: {
    type: String,
    required: true,
    enum: ["Comment", "Post"],
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export default model<Comment & Document<any>>("Comment", schema);
