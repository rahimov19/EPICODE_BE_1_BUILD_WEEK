import express from "express";
import createHttpError from "http-errors";
import ExperienceModel from "./model.js";
import q2m from "query-to-mongo";

const experienceRouter = express.Router();

experienceRouter.post("/", async (req, res, next) => {
  try {
    const newExperience = new ExperienceModel(req.body);

    const { _id } = await newExperience.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

experienceRouter.get("/", async (req, res, next) => {
  try {
    // let mongoQuery;
    // if (req.query.limit && req.query.skip && limit < 50) {
    //   mongoQuery = q2m(req.query);
    // } else {
    //   mongoQuery = q2m({ skip: 1, limit: 1 });
    // }
    const mongoQuery = q2m(req.query);
    const { total, experiences } =
      await ExperienceModel.findExperiencesWithReviews(mongoQuery);

    res.send({
      links: mongoQuery.links("http://localhost:3001/experiences", total),
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      experiences,
    });
  } catch (error) {
    next(error);
  }
});

experienceRouter.get("/:experienceId", async (req, res, next) => {
  try {
    const experience = await ExperienceModel.findById(
      req.params.experienceId
    ).populate({
      path: "reviews",
    });
    if (experience) {
      res.send({
        experience,
      });
    } else {
      next(
        createHttpError(
          404,
          `Experience with id ${req.params.experienceId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

experienceRouter.put("/:experienceId", async (req, res, next) => {
  try {
    const updatedExperience = await ExperienceModel.findByIdAndUpdate(
      req.params.experienceId,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedExperience) {
      res.send(updatedExperience);
    } else {
      next(
        createHttpError(
          404,
          `Experience with id ${req.params.experienceId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

experienceRouter.delete("/:experienceId", async (req, res, next) => {
  try {
    const deletedExperience = await ExperienceModel.findByIdAndDelete(
      req.params.experienceId
    );

    if (deletedExperience) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Experience with id ${req.params.experienceId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
