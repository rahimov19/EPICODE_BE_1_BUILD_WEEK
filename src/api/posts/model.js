import mongoose from "mongoose";
import commentsSchema from "./commentsModel.js";
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    text: { type: String, required: true },
    username: { type: String, required: true },
    image: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    comments: [commentsSchema],
  },
  { timestamps: true }
);

export default model("Post", postSchema);
