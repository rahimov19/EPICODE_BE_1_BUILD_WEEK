import mongoose from "mongoose";

const { Schema, model } = mongoose;

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    area: { type: String },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String },
    experience: { type: mongoose.Types.ObjectId, ref: "Experience" },
    title: { type: String },
    username: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model("User", usersSchema);
