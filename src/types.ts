import type { RequestHandler } from "express";
import type { Document } from "mongoose";

export type Post = {
  title: string;
  content: string;
};

export type Comment = {
  content: string;
  parent: string;
  parentType: "Comment" | "Post";
};

export enum FailureResponseMessage {
  INVALID_ID = "Id is invalid",
  NOT_FOUND = "These is no item provided by specified id",
  MISSING_PARAMS = "Required params are empty",
  PARRENT_NOT_VALID = "Specified parrent is not valid",
}

export type FailureResponse = {
  message: FailureResponseMessage;
};

export type BlogRequestHandler<T = any> = RequestHandler<
  { id: string },
  Document | Document[] | FailureResponse,
  T
>;
export type PostRequestHandler = BlogRequestHandler<Post>;

export type CommentRequestHandler = BlogRequestHandler<Comment>;
