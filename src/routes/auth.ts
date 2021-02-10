import { Router } from "express";
import UserModel from "../models/User";
import { FailureResponseMessage, SignUpRequestHandler } from "../types";
import { isEveryFieldExist, toBase64 } from "./utils";

const signup: SignUpRequestHandler = async (req, res) => {
  const { username, password } = req.body;
  if (!isEveryFieldExist(username, password))
    return res
      .status(400)
      .json({ message: FailureResponseMessage.MISSING_PARAMS });

  const user = await UserModel.find({ username });
  if (user.length)
    return res
      .status(400)
      .json({ message: FailureResponseMessage.NOT_UNIQUE_USERNAME });
  const userModel = new UserModel({ username, password });
  await userModel.save();
  const token = toBase64(`${username}:${password}`);
  res.json({ token, username });
};

const router = Router().post("/signup", signup);

export default router;
