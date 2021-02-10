import { RequestHandler } from "express";
import { Document, Model } from "mongoose";
import CommentModel from "../models/Comment";
import UserModel from "../models/User";
import {
  CommentRequestHandler,
  FailureResponseMessage,
  Comment,
} from "../types";

export const isValidId = (id: string) => id.match(/^[0-9a-fA-F]{24}$/);

export const isEveryFieldExist = (...params: string[]): boolean =>
  params.every((value) => value !== undefined && value !== null);

export const validateId: CommentRequestHandler = (req, res, next) =>
  isValidId(req.params.id)
    ? next()
    : res.status(400).json({
        message: FailureResponseMessage.INVALID_ID,
      });

export const toBase64 = (s: string) => Buffer.from(s).toString("base64");
export const fromBase64 = (b: string) =>
  Buffer.from(b, "base64").toString("utf-8");

export const authentication: RequestHandler = async (req: any, res, next) => {
  if (!req.token)
    return res
      .status(400)
      .json({ message: FailureResponseMessage.MISSING_TOKEN });

  const [username, password] = fromBase64(req.token).split(":");
  const user = await UserModel.find({ username, password });
  if (!user.length)
    return res
      .status(403)
      .json({ message: FailureResponseMessage.UNAUTHORIZED });

  req.body.user = user[0];
  return next();
};

export const parseCommentDocument = (doc: Comment & Document<any>): Comment => {
  const { _id, content, parent, parentType, author } = doc;
  return { id: _id, content, parent, parentType, author };
};

export const childsOf = (parentType: "Comment" | "Post") => async (
  parrentId?: string
): Promise<Comment[]> => {
  const childs = await CommentModel.find({ parent: parrentId, parentType });
  const populated = await Promise.all(
    childs.map((child) => child.populate("author", "username").execPopulate())
  );
  populated.map(async (p) => ({
    ...p,
    comments: await childsOf("Comment")(p.id),
  }));

  return Promise.all(
    populated.map(parseCommentDocument).map(async (p) => ({
      ...p,
      comments: await childsOf("Comment")(p.id),
    }))
  );
};
