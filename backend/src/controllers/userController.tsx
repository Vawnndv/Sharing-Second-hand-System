// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from 'dotenv';
dotenv.config();
import asyncHandle from 'express-async-handler';
import { Request, Response } from 'express';

import { Account } from '../classDiagramModel/Account';

const getProfile = asyncHandle(async (req: Request, res: Response) => {
  const { email } = req.query;

  const existingUser = await Account.findUserByEmail(email);

  if (!existingUser) {
    res.status(401);
    throw new Error('Email is invalid!!!');
  }

  console.log (existingUser);

  res.status(200).json({
    message: 'Login successfully!!!',
    data: {
      ...existingUser,
      password: null,
    },
  });
});