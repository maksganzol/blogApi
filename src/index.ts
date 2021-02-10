import express from "express";
import mongoose from "mongoose";
import comments from "./routes/comments";
import posts from "./routes/posts";
import config from "./config";
import bearerToken from "express-bearer-token";
import auth from "./routes/auth";
import Post from "./models/Post";

const { port, mongoUrl } = config;

const app = express();
app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(bearerToken())
  .use(auth)
  .use(comments)
  .use(posts);

app.listen(port, () => console.log(`Listen on port ${port}`));

mongoose
  .connect(mongoUrl, { useFindAndModify: false, useNewUrlParser: true })
  .then((db) => {
    console.log(`Connected to db`);
  })
  .catch((error) => {
    console.log(`Failed to connect,`, error);
  });
