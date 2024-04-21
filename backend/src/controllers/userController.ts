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
        phonenumber: user.phonenumber ?? '',
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
  console.log(req.body);
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



export const changeUserProfile = asyncHandle(async (req: Request, res: Response) => {
  console.log(req.body);
  const { email, firstname, lastname, phonenumber, avatar } = req.body;

  const user = await Account.findUserByEmail(email);
  
  if (user) {      
    const updateUser = await Account.updateAccountProfile(user.userid, firstname, lastname, phonenumber, avatar);

    if (updateUser) {
      res.status(200).json({
        message: 'Profile changed successfully!!!',
        data: {
          email,
          firstName: updateUser.firstname,
          lastName: updateUser.lastname,
          phoneNumber: updateUser.phonenumber,
          avatar: updateUser.avatar,
        },
      });
    } else {
      res.status(400);
      throw new Error('Update error!!!');
    }
  } else {
    res.status(401);
    throw new Error('User not found!!!');
  } 
});


export const getUserLikePosts = asyncHandle(async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (typeof userId === 'string' && userId) {
    const likePosts = await Account.findUserLikePostsById(userId);
    console.log(likePosts, 'BE');
    res.status(200).json({
      message: 'Get user like posts successfully !!!',
      data: likePosts,
    });
  } else {
    res.sendStatus(401);
    throw new Error('Missing uid');
  }
});

export const setUserLikePosts = asyncHandle(async (req: Request, res: Response) => {
  const { userId, postId } = req.body;
  console.log(req.body);
  if (postId && postId) {
    const likePosts = await Account.setUserLikePostsById(userId, postId);

    res.status(200).json({
      message: `Ins user id ${userId} like posts id ${postId} successfully !!!`,
      data: likePosts,
    });
  } else {
    res.sendStatus(401);
    throw new Error('Missing uid');
  }
});

export const deleteUserLikePosts = asyncHandle(async (req: Request, res: Response) => {
  const { userId, postId } = req.query;
  if (typeof userId === 'string' && userId && typeof postId === 'string' && postId) {
    const likePosts = await Account.deleteUserLikePostsById(userId, postId);

    res.status(200).json({
      message: `Delete user id ${userId} like posts id ${postId} successfully !!!`,
      data: likePosts,
    });
  } else {
    res.sendStatus(401);
    throw new Error('Missing uid');
  }
});