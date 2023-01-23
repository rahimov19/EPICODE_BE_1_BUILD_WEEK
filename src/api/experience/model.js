import mongoose from "mongoose";
const { Schema, model } = mongoose;

const experiencesSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    description: { type: String, required: true },
    area: { type: String, required: true },
    image: { type: String, default: "https://via.placeholder.com/250" },
  },
  {
    timestamps: true,
  }
);
experiencesSchema.static("findExperiencess", async function (query) {
  const total = await this.countDocuments(query.criteria);
  const experiences = await this.find(query.criteria, query.options.fields)
    .sort(query.options.sort)
    .skip(query.options.skip)
    .limit(query.options.limit);

  return { total, experiences };
});
export default model("experiences", experiencesSchema);
