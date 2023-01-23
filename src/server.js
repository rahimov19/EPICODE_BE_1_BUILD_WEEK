import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";

import {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";

import usersRouter from "./api/users/index.js";
import postsRouter from "./api/posts/index.js";
import filesRouter from "./api/files/index.js";

const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(express.json());

server.use("/users", usersRouter);
server.use("/posts", postsRouter);
server.use("/files", filesRouter);

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server), console.log(`Server port is ${port}`));
  });
});
