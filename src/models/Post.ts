import { model, Schema, Document } from "mongoose";
import { Post } from "../types";

const schema = new Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export default model<Post & Document<any>>("Post", schema);
