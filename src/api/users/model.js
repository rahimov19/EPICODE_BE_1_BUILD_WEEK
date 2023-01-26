import mongoose from "mongoose";

import experienceSchema from "./experienceModel.js";
import requestSchema from "../requests/model.js";
const { Schema, model } = mongoose;

export const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    area: { type: String },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String },
    experiences: [experienceSchema],
    connections: {
      pending: [requestSchema],
      active: [],
    },
    title: { type: String },
    username: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model("User", usersSchema);
