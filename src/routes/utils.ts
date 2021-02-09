import { CommentRequestHandler, FailureResponseMessage } from "../types";

export const isValidId = (id: string) => id.match(/^[0-9a-fA-F]{24}$/);

export const isEveryFieldExist = (...params: string[]): boolean =>
  params.every((value) => value !== undefined && value !== null);

export const validateId: CommentRequestHandler = (req, res, next) =>
  isValidId(req.params.id)
    ? next()
    : res.status(400).json({
        message: FailureResponseMessage.INVALID_ID,
      });
