import express, { request } from "express";
import UsersModel from "../users/model.js";
import httpErrors from "http-errors";

const { NotFound } = httpErrors;

const requestsRouter = express.Router();

requestsRouter.post("/:targetUserId/pending", async (req, res, next) => {
  try {
    const currentUserId = req.body.user;
    const targetUserId = req.params.targetUserId;
    const currentUser = await UsersModel.findById(currentUserId);
    if (currentUser) {
      const index = currentUser.connections.active.findIndex(
        (connection) => connection.toString() === targetUserId
      );
      console.log(index);
      if (index !== -1) {
        res.send(`You are already connected with user ${targetUserId}`);
      } else {
        const updatedTargetUser = await UsersModel.findByIdAndUpdate(
          targetUserId,
          { $push: { "connections.pending": req.body } },
          { new: true, runValidators: true }
        );
        if (updatedTargetUser) {
          res.status(201).send("Request was sent successfully");
        } else {
          next(NotFound(`TargetUser with id ${userId} was not found`));
        }
      }
    } else {
      next(
        NotFound(
          `Your current user with id ${currentUserId} was not found and is unabble to make a request`
        )
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

requestsRouter.put(
  "/:currentUserId/acceptRequest/:requestId",
  async (req, res) => {
    try {
      const currentUserId = req.params.currentUserId;
      const requestId = req.params.requestId;
      const user = await UsersModel.findById(currentUserId);
      const index = user.connections.pending.findIndex(
        (req) => req._id.toString() === requestId
      );
      const request = user.connections.pending[index];
      console.log(request);
      const updatedcurrentUser = await UsersModel.findByIdAndUpdate(
        currentUserId,
        {
          $push: { "connections.active": request.user },
          $pull: { "connections.pending": { _id: requestId } },
        },
        { new: true, runValidators: true }
      );
      if (updatedcurrentUser) {
        await UsersModel.findByIdAndUpdate(
          request.user,
          { $push: { "connections.active": currentUserId } },
          { new: true, runValidators: true }
        );
        res.send(updatedcurrentUser);
      } else {
        next(NotFound(`Current user with id ${currentUserId} was not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

requestsRouter.put(
  "/:currentUserId/declineRequest/:requestId",
  async (req, res, next) => {
    try {
      const currentUserId = req.params.currentUserId;
      const requestId = req.params.requestId;
      const updatedcurrentUser = await UsersModel.findByIdAndUpdate(
        currentUserId,
        { $pull: { "connections.pending": { _id: requestId } } },
        { new: true }
      );
      if (updatedcurrentUser) {
        res.send(updatedcurrentUser);
      } else {
        next(NotFound(`Current user with id ${currentUserId} was not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

requestsRouter.get("/:targetUserId/", async (req, res, next) => {
  try {
    const userId = req.params.targetUserId;
    const user = await UsersModel.findById(userId);
    if (user) {
      const connections = user.connections;
      res.send(connections);
    } else {
      next(NotFound(`User with id ${userId} not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

requestsRouter.delete(
  "/:currentUserId/deleteConnection/:targetUserId",
  async (req, res, next) => {
    try {
      const currentUserId = req.params.currentUserId;
      const targetUserId = req.params.targetUserId;
      const updatedCurrentUser = await UsersModel.findByIdAndUpdate(
        currentUserId,
        { $pull: { "connections.active": targetUserId } },
        { new: true }
      );
      if (updatedCurrentUser) {
        res.send(updatedCurrentUser);
      } else {
        next(NotFound(`User with id ${targetUserId} not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default requestsRouter;
