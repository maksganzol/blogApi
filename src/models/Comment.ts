import { model, Schema } from "mongoose";

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
});

export default model("Comment", schema);
