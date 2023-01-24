import mongoose from "mongoose";

import experienceSchema from "./experienceModel.js";
const { Schema, model } = mongoose;

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    area: { type: String },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String },
    experiences: [experienceSchema],
    title: { type: String },
    username: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model("User", usersSchema);
