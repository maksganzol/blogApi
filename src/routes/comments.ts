import { Router } from "express";

import CommentModel from "../models/Comment";
import PostModel from "../models/Post";

import {
  FailureResponseMessage,
  CommentRequestHandler,
  Comment,
} from "../types";
import { isEveryFieldExist, isValidId, validateId } from "./utils";

const validateParent = async (
  parentId: string,
  parentType: Comment["parentType"]
): Promise<boolean> => {
  const model = parentType === "Comment" ? CommentModel : PostModel;
  return Boolean(isValidId(parentId) && (await model.findById(parentId)));
};

const create: CommentRequestHandler = async (req, res) => {
  const { content, parent, parentType } = req.body;
  if (!isEveryFieldExist(content, parent, parentType)) {
    return res
      .status(400)
      .json({ message: FailureResponseMessage.MISSING_PARAMS });
  }

  const isValidParrent = await validateParent(parent, parentType);
  if (!isValidParrent)
    return res
      .status(400)
      .json({ message: FailureResponseMessage.PARRENT_NOT_VALID });

  const comment = new CommentModel({
    content,
    parent,
    parentType,
  });

  const doc = await comment.save();
  return res.json(doc);
};

const read: CommentRequestHandler = async (req, res) => {
  const comment = await CommentModel.findById(req.params.id);
  return comment
    ? res.json(comment)
    : res.status(404).json({ message: FailureResponseMessage.NOT_FOUND });
};

const update: CommentRequestHandler = async ({ params, body }, res) => {
  const { content } = body;

  await CommentModel.updateOne({ _id: params.id }, { content });

  const updatedComment = await CommentModel.findById(params.id);
  return updatedComment
    ? res.json(updatedComment)
    : res.status(404).json({ message: FailureResponseMessage.NOT_FOUND });
};

const remove: CommentRequestHandler = async ({ params }, res) => {
  const comment = await CommentModel.findOneAndDelete({ _id: params.id });
  return comment
    ? res.json(comment)
    : res.status(404).json({ message: FailureResponseMessage.NOT_FOUND });
};

const list: CommentRequestHandler = async (_, res) => {
  const comments = await CommentModel.find({});
  return res.json(comments);
};

const router = Router()
  .use("/comments/:id", validateId)
  .post("/comments", create)
  .get("/comments/:id", read)
  .put("/comments/:id", update)
  .delete("/comments/:id", remove)
  .get("/comments", list);

export default router;
