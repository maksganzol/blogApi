import { RequestHandler, Router } from "express";

import PostModel from "../models/Post";
import {
  BlogRequestHandler,
  FailureResponseMessage,
  Post,
  PostRequestHandler,
} from "../types";
import {
  authentication,
  childsOf,
  isEveryFieldExist,
  validateId,
} from "./utils";
import { Document } from "mongoose";
import User from "../models/User";

const postChilds = childsOf("Post");

const parsePostDocument = (doc: Post & Document<any>): Post => {
  const { title, content, _id, author } = doc;
  return { title, content, id: _id, author: author.username };
};

const create: PostRequestHandler = async (req, res) => {
  const { title, content, user } = req.body;
  if (!isEveryFieldExist(title, content)) {
    return res
      .status(400)
      .json({ message: FailureResponseMessage.MISSING_PARAMS });
  }
  const post = new PostModel({
    title,
    content,
    author: user.id,
  });
  const doc = await post
    .save()
    .then((p) => p.populate("author", "username -_id").execPopulate());

  return res.json({
    ...parsePostDocument(doc),
    comments: [],
  });
};

const read: PostRequestHandler = async (req, res) => {
  const postDoc = await PostModel.findById(req.params.id);
  if (!postDoc)
    return res.status(404).json({ message: FailureResponseMessage.NOT_FOUND });

  const post = await postDoc
    .populate("author", "username -_id")
    .execPopulate()
    .then(parsePostDocument);

  const comments = await postChilds(post.id);
  const t = { ...post, comments };
  return res.json(t);
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

  const updatedPostDoc = await PostModel.findById(params.id);
  if (!updatedPostDoc)
    return res.status(404).json({ message: FailureResponseMessage.NOT_FOUND });

  const updatedPost = parsePostDocument(updatedPostDoc);
  const comments = await postChilds(updatedPost.id);
  return res.json({
    ...updatedPost,
    comments,
  });
};

const remove: PostRequestHandler = async ({ params }, res) => {
  const postDoc = await PostModel.findOneAndDelete({ _id: params.id });
  if (!postDoc)
    return res.status(404).json({ message: FailureResponseMessage.NOT_FOUND });
  const post = parsePostDocument(postDoc);
  const comments = await postChilds(post.id);
  return res.json({
    ...post,
    comments,
  });
};

const list: RequestHandler<any, { title: string; id: string }[]> = async (
  req,
  res
) => {
  const limit = 5;
  const page = Number(req.query.page || 0);
  const posts = await PostModel.find({}, "title", {
    skip: page * limit,
    limit,
  });

  return res.json(posts.map(({ title, _id }) => ({ title, id: _id })));
};

const router = Router()
  .use(authentication)
  .use("/posts/:id", validateId)
  .post("/posts", create)
  .get("/posts/:id", read)
  .put("/posts/:id", update)
  .delete("/posts/:id", remove)
  .get("/posts", list);

export default router;
