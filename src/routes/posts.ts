import { Router } from "express";

import PostModel from "../models/Post";
import { FailureResponseMessage, PostRequestHandler } from "../types";
import { isEveryFieldExist, isValidId } from "./utils";

const validateId: PostRequestHandler = (req, res, next) =>
  isValidId(req.params.id)
    ? next()
    : res.status(400).json({
        message: FailureResponseMessage.INVALID_ID,
      });

const create: PostRequestHandler = async (req, res) => {
  const { title, content } = req.body;
  if (!isEveryFieldExist(title, content)) {
    title;
    return res
      .status(400)
      .json({ message: FailureResponseMessage.MISSING_PARAMS });
  }
  const post = new PostModel({
    title,
    content,
  });
  const doc = await post.save();
  return res.json(doc);
};

const read: PostRequestHandler = async (req, res) => {
  const post = await PostModel.findById(req.params.id);
  return post
    ? res.json(post)
    : res.status(404).json({ message: FailureResponseMessage.NOT_FOUND });
};

const update: PostRequestHandler = async ({ params, body }, res) => {
  const { title, content } = body;

  await PostModel.updateOne(
    { _id: params.id },
    {
      title,
      content,
    }
  );

  const updatedPost = await PostModel.findById(params.id);
  return updatedPost
    ? res.json(updatedPost)
    : res.status(404).json({ message: FailureResponseMessage.NOT_FOUND });
};

const remove: PostRequestHandler = async ({ params }, res) => {
  const post = await PostModel.findOneAndDelete({ _id: params.id });
  return post
    ? res.json(post)
    : res.status(404).json({ message: FailureResponseMessage.NOT_FOUND });
};

const list: PostRequestHandler = async (_, res) => {
  const posts = await PostModel.find({});
  return res.json(posts);
};

const router = Router()
  .use("/posts/:id", validateId)
  .post("/posts", create)
  .get("/posts/:id", read)
  .put("/posts/:id", update)
  .delete("/posts/:id", remove)
  .get("/posts", list);

export default router;
