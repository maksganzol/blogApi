import { Router } from "express";
import CommentModel from "../models/Comment";
import PostModel from "../models/Post";

import {
  FailureResponseMessage,
  CommentRequestHandler,
  Comment,
} from "../types";
import {
  authentication,
  childsOf,
  isEveryFieldExist,
  isValidId,
  parseCommentDocument,
  validateId,
} from "./utils";

const commentChilds = childsOf("Comment");

const validateParent = async (
  parentId: string,
  parentType: Comment["parentType"]
): Promise<boolean> => {
  const model = parentType === "Comment" ? CommentModel : PostModel;
  return Boolean(isValidId(parentId) && (await model.findById(parentId)));
};

const create: CommentRequestHandler = async (req, res) => {
  const { content, parent, parentType, user } = req.body;
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

  const commentModel = new CommentModel({
    content,
    parent,
    parentType,
    author: user.id,
  });

  const comment = await (await commentModel.save())
    .populate("author", "username -_id")
    .execPopulate()
    .then(parseCommentDocument);

  return res.json({
    ...comment,
    comments: [],
  });
};

const read: CommentRequestHandler = async (req, res) => {
  const commentDoc = await CommentModel.findById(req.params.id);
  if (!commentDoc)
    return res.status(404).json({ message: FailureResponseMessage.NOT_FOUND });

  const comment = await commentDoc
    .populate("author", "username -_id")
    .execPopulate()
    .then(parseCommentDocument);

  const comments = await commentChilds(comment.id);

  return res.json({
    ...comment,
    comments,
  });
};

const update: CommentRequestHandler = async ({ params, body }, res) => {
  const { content } = body;

  await CommentModel.updateOne({ _id: params.id }, { content });

  const updatedCommentDoc = await CommentModel.findById(params.id);
  if (!updatedCommentDoc)
    return res.status(404).json({ message: FailureResponseMessage.NOT_FOUND });

  const updatedComment = parseCommentDocument(updatedCommentDoc);
  const comments = await commentChilds(updatedComment.id);

  return res.json({
    ...updatedComment,
    comments,
  });
};

const remove: CommentRequestHandler = async ({ params }, res) => {
  const commentDoc = await CommentModel.findOneAndDelete({ _id: params.id });
  if (!commentDoc)
    return res.status(404).json({ message: FailureResponseMessage.NOT_FOUND });

  const comment = parseCommentDocument(commentDoc);
  const comments = await commentChilds(comment.id);

  return res.json({
    ...comment,
    comments,
  });
};

const router = Router()
  .use(authentication)
  .use("/comments/:id", validateId)
  .post("/comments", create)
  .get("/comments/:id", read)
  .put("/comments/:id", update)
  .delete("/comments/:id", remove);

export default router;
