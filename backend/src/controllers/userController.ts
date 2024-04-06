import dotenv from 'dotenv';
dotenv.config();
import asyncHandle from 'express-async-handler';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { Account } from '../classDiagramModel/Account';

export const getProfile = asyncHandle(async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (typeof userId === 'string' && userId) {
    console.log(userId);
    const user = await Account.findUserById(userId);

    res.status(200).json({
      message: 'Get user profile successfully!!!',
      data: {
        userId: user.userid,
        createAt: user.createat,
        address: user.address ?? '',
        firstname: user.firstname ?? '',
        lastname: user.lastname ?? '',
        avatar: user.avatar ?? '',
        username: user.username ?? '',
        email: user.email ?? '',
      },
    });
  } else {
    res.sendStatus(401);
    throw new Error('Missing uid');
  }
});


export const changeUserPassword = asyncHandle(async (req: Request, res: Response) => {
  console.log(req.body);
  const { email, oldPassword, newPassword } = req.body;

  const user = await Account.findUserByEmail(email);
  
  if (user) {
    const checkPassword = await bcrypt.compare(oldPassword, user.password);

    
    if (checkPassword) {
      if (oldPassword === newPassword) {
        res.status(400);
        throw new Error('New password must different from old password!!!');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      const updateUser = await Account.updateAccountPassword(user.userid, hashedPassword);

      if (updateUser) {
        res.status(200).json({
          message: 'Password changed successfully!!!',
          data: {},
        });
      } else {
        res.status(400);
        throw new Error('Update error!!!');
      }
    } else {
      res.status(400);
      throw new Error('Invalid old password!!!');
    } 
  } else {
    res.status(401);
    throw new Error('User not found!!!');
  }
});