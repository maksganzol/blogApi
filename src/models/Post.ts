import { model, Schema, Document } from "mongoose";
import { Post } from "../types";

const schema = new Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
});

export default model("Post", schema);
