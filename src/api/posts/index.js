import express, { request } from "express";
import httpErrors from "http-errors";
import PostsModel from "./model.js";
import UsersModel from "../users/model.js";
import { checkpostSchema, triggerPostsBadRequest } from "./validator.js";

const { NotFound } = httpErrors;

const postsRouter = express.Router();

postsRouter.post(
  "/",
  checkpostSchema,
  triggerPostsBadRequest,
  async (req, res, next) => {
    try {
      const userId = req.body.user;
      const user = await UsersModel.findById(userId);
      if (user) {
        const newPost = new PostsModel({
          ...req.body,
          image:
            "https://img.freepik.com/vektoren-kostenlos/organische-flache-blogpostillustration-mit-leuten_23-2148955260.jpg",
        });
        const { _id } = await newPost.save();
        res.status(201).send(`Post with id ${_id} created successfully`);
      } else {
        next(NotFound(`User with id ${userId} not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

postsRouter.get("/", async (req, res, next) => {
  try {
    const posts = await PostsModel.find().populate("user");
    res.send(posts);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

postsRouter.get("/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await PostsModel.findById(postId).populate("user");
    if (postId) {
      res.send(post);
    } else {
      next(NotFound(`Post with id ${postId} not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

postsRouter.put(
  "/:postId",

  async (req, res, next) => {
    try {
      const postId = req.params.postId;
      const updatedPost = await PostsModel.findByIdAndUpdate(postId, req.body, {
        new: true,
        runValidators: true,
      });
      if (updatedPost) {
        res.send(updatedPost);
      } else {
        next(NotFound(`Post with id ${postId} not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

postsRouter.delete("/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const deletedPost = await PostsModel.findByIdAndDelete(postId);
    if (deletedPost) {
      res.status(204).send();
    } else {
      next(NotFound(`Post with id ${postId} not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default postsRouter;
