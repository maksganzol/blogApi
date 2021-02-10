import type { RequestHandler } from "express";

export type Post = {
  title: string;
  content: string;
  author: string;
  id?: string;
};

export type Comment = {
  id?: string;
  author: string;
  content: string;
  parent: string;
  parentType: "Comment" | "Post";
};

export type User = {
  id?: string;
  username: string;
  password: string;
};

type Commented<T extends Post | Comment> = T & {
  comments: Comment[];
};

export enum FailureResponseMessage {
  INVALID_ID = "Id is invalid",
  NOT_FOUND = "These is no item provided by specified id",
  MISSING_PARAMS = "Required params are empty",
  PARRENT_NOT_VALID = "Specified parrent is not valid",
  MISSING_TOKEN = "Missed authorization token",
  UNAUTHORIZED = "Unauthorized user",
  NOT_UNIQUE_USERNAME = "User with such username already exists",
}

export type FailureResponse = {
  message: FailureResponseMessage;
};

export type BlogRequestHandler<
  RequestItem = any,
  ResponseItem = any
> = RequestHandler<
  { id: string },
  ResponseItem | ResponseItem[] | FailureResponse,
  RequestItem
>;
export type PostRequestHandler = BlogRequestHandler<
  Post & { user: User },
  Commented<Post>
>;

export type CommentRequestHandler = BlogRequestHandler<
  Comment & { user: User },
  Commented<Comment>
>;

export type SignUpRequestHandler = RequestHandler<
  any,
  { token: string; username: string } | FailureResponse,
  User
>;
