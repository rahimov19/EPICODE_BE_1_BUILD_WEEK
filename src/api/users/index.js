import express from "express";
import createHttpError from "http-errors";
import UsersModel from "./model.js";
import q2m from "query-to-mongo";
import { checkUserSchema, triggerBadRequest } from "./validator.js";

const usersRouter = express.Router();

usersRouter.post(
  "/",
  checkUserSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newUser = new UsersModel(req.body);
      console.log(newUser);

      const duplicate = await UsersModel.findOne({
        username: newUser.username,
      });
      if (duplicate) {
        next(createHttpError(400, "Username already exist"));
      } else {
        const { _id } = await newUser.save();
        res.status(201).send({ _id });
      }
    } catch (error) {
      next(error);
    }
  }
);
usersRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const total = await UsersModel.countDocuments(mongoQuery.criteria);
    const users = await UsersModel.find(
      mongoQuery.criteria,
      mongoQuery.options.fields
    )
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort)
      .populate({
        path: "experience",
      });
    res.send({
      links: mongoQuery.links("http://localhost:3001/users", total),
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      users,
    });
  } catch (error) {
    next(error);
  }
});
usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId).populate({
      path: "experience",
    });
    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} is not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});
usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} is not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});
usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const deletedUser = await UsersModel.findByIdAndDelete(req.params.userId);
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} is not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
