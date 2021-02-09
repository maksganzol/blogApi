import { RequestHandler } from "express";
import { Document } from "mongoose";

export type Post = {
  title: string;
  content: string;
};

export enum FailureResponseMessage {
  INVALID_ID = "Id is invalid",
  NOT_FOUND = "These is no item provided by specified id",
  MISSING_PARAMS = "Required params are empty",
}

export type FailureResponse = {
  message: FailureResponseMessage;
};

export type PostRequestHandler = RequestHandler<
  { id: string },
  Document | Document[] | FailureResponse,
  Post
>;
