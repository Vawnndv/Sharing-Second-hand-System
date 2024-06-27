import dotenv from 'dotenv';
dotenv.config();
import asyncHandle from 'express-async-handler';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import { Account } from '../classDiagramModel/Account';
import { UserManager } from '../classDiagramModel/Manager/UserManager';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.USERNAME_EMAIL,
    pass: process.env.PASSWORD,
  },
});

const getJsonWebAccessToken = async (id: number) => {
  const payload = {
    id,
  };
  const secret = process.env.ACCESS_TOKEN_KEY;

  // Kiểm tra xem ACCESS_TOKEN_KEY đã được định nghĩa hay chưa
  if (!secret) {
    console.error('ACCESS_TOKEN_KEY is not defined in environment variables.');
    process.exit(1); // Thoát ứng dụng với mã lỗi 1
  }
  
  const token = jwt.sign(payload, secret, {
    expiresIn: '1d',
  });

  return token;
};


const getJsonWebRefreshToken = async (id: number) => {
  const payload = {
    id,
  };
  console.log(id);
  const secret = process.env.REFRESH_TOKEN_KEY;

  // Kiểm tra xem REFRESH_TOKEN_KEY đã được định nghĩa hay chưa
  if (!secret) {
    console.error('REFRESH_TOKEN_KEY is not defined in environment variables.');
    process.exit(1); // Thoát ứng dụng với mã lỗi 1
  }
  
  // const REFRESH_TOKEN_KEY = 'khoahoctunhien';
  const token = jwt.sign(payload, secret, {
    expiresIn: '7d',
  });

  return token;
};


export const handleSendMail = async (val: {}) => {
  try {
    await transporter.sendMail(val);

    return 'Send verification code successfully!!!';
  } catch (error) {
    return error;
  }
};

export const verification = asyncHandle(async (req: Request, res: Response) => {
  const { email } = req.body;

  const existingUser = await Account.findUserByEmail(email);

  if (existingUser) {
    res.status(401);
    throw new Error('User has already exist!!!');
  }
  
  const verificationCode = Math.round(1000 + Math.random() * 9000);
  
  try {
    const data = {
      from: `"ReTreasure Application" <${process.env.USERNAME_EMAIL}>`, 
      to: email,
      subject: 'Verification email code', 
      text: 'Your code to verification email',
      html: `<h1>${verificationCode}</h1>`,
    };

    await handleSendMail(data);

    res.status(200).json({
      message: 'Send verification code successfully!!!',
      data: {
        code: verificationCode,
      },
    });
  } catch (error) {
    res.send(401);
    throw new Error('Can not send email');
  }
});

// Controller function to handle refresh token
export const refreshAccessToken = asyncHandle(async (req: Request, res: Response) => {
  const { userid, deviceid } = req.body;

  console.log(req.body, '13123');
  if (!userid || !deviceid) {
    res.status(400).json({ message: 'userid and deviceid are required' });
    return;
  }


  const secret = process.env.REFRESH_TOKEN_KEY;
  if (!secret) {
    console.error('REFRESH_TOKEN_KEY is not defined in environment variables.');
    process.exit(1); // Exit application with error code 1
  }

  const { refreshtoken } = await UserManager.getRefreshTokenOfUser(userid, deviceid);

  if (!refreshtoken) {
    res.status(403).json({ message: 'RefreshToken not found' });
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jwt.verify(refreshtoken, secret, async (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ message: 'Not authorized, token failed!' });
    } else {
      const accessToken = await getJsonWebAccessToken(userid);
      console.log(accessToken);

      res.status(200).json({ 
        message: 'Access token refreshed successfully',
        accessToken,
      });
    }
  });
});


export const register = asyncHandle(async (req: Request, res: Response) => {
  const { email, firstname, lastname, password } = req.body;

  const existingUser = await Account.findUserByEmail(email);

  if (existingUser) {
    res.status(401);
    throw new Error('User has already exist!!!');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await Account.createItem(
    email,
    firstname, 
    lastname,
    hashedPassword,
    '',
    1,
  );

  res.status(200).json({
    message: 'Register new user successfully',
    data: {
      email,
      id: newUser.userid,
      firstName: newUser.firstname,
      lastName: newUser.lastname,
      avatar: newUser.avatar,
      roleID: newUser.roleid, 
      accessToken: await getJsonWebAccessToken(newUser.userid),
    },
  });
});

export const login = asyncHandle(async (req: Request, res: Response) => {
  const { platform, email, password } = req.body;
  const existingUser = await Account.findUserByEmail(email);

  if (!existingUser) {
    res.status(400);
    throw new Error('Email is invalid!!!');
  }

  const isMatchPassword = await bcrypt.compare(password, existingUser.password);

  if (!isMatchPassword) {
    res.status(400);
    throw new Error('Password is invalid!!!');
  }

  if (existingUser.isbanned) {
    res.status(400);
    throw new Error('Tài khoản của bạn đã bị khóa');

  }
  
  const fcmTokens = await Account.getFcmTokenListOfUser(existingUser.userid);  
  
  const refreshToken = await getJsonWebRefreshToken(existingUser.userid);

  if (platform === 'web' && existingUser.roleid > 1) {
    console.log(refreshToken);
    const refreshtoken = await UserManager.addRefreshTokenToUser(existingUser.userid, refreshToken);
    res.status(200).json({
      message: 'Login successfully!!!',
      data: {
        id: existingUser.userid,
        email: existingUser.email,
        firstName: existingUser.firstname,
        lastName: existingUser.lastname,
        avatar: existingUser.avatar,
        roleID: existingUser.roleid,
        deviceid: refreshtoken.deviceid,
        accessToken: await getJsonWebAccessToken(existingUser.userid),
      },
    });
  } else if (platform === 'web' && existingUser.roleid === 1) {
    res.status(400);
    throw new Error('Tài khoản của bạn không có quyền truy cập vào trang web');
  } else {
    const refreshtoken = await UserManager.addRefreshTokenToUser(existingUser.userid, refreshToken);
    res.status(200).json({
      message: 'Login successfully!!!',
      data: {
        id: existingUser.userid,
        email: existingUser.email,
        firstName: existingUser.firstname,
        lastName: existingUser.lastname,
        avatar: existingUser.avatar,
        roleID: existingUser.roleid,
        fcmTokens: fcmTokens ?? [],
        deviceid: refreshtoken.deviceid,
        accessToken: await getJsonWebAccessToken(existingUser.userid),
      },
    });
  }
});

export const forgotPassword = asyncHandle(async (req: Request, res: Response) => {

  const { email } = req.body;

  const randomPassword = Math.round(100000 + Math.random() * 99000);

  const data = {
    from: `"New Password" <${process.env.USERNAME_EMAIL}>`, 
    to: email,
    subject: 'Verification email code', 
    text: 'Your code to verification email',
    html: `<h1>${randomPassword}</h1>`,
  };

  const user = await Account.findUserByEmail(email);

  if (user) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(`${randomPassword}`, salt);

    const updateUser = await Account.updateAccountPassword(user.userid, hashedPassword);

    if (updateUser) {
      await handleSendMail(data).then(() => {
        res.status(200).json({
          message: 'Send my new password successfully!!!',
          data: {},
        });
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

export const handleLoginWithGoogle = asyncHandle(async (req, res) => {
  const { email, firstname, lastname, avatar } = req.body;

  const existingUser = await Account.findUserByEmail(email);

  if (existingUser) {
    const fcmTokens = await Account.getFcmTokenListOfUser(existingUser.userid);  

    const data = {
      id: existingUser.userid,
      email: existingUser.email,
      firstName: existingUser.firstname,
      lastName: existingUser.lastname,
      avatar: existingUser.avatar,
      roleID: existingUser.roleid,
      fcmTokens: fcmTokens ?? [],
      accessToken: await getJsonWebAccessToken(existingUser.userid),
    };

    res.status(200).json({
      message: 'Login with google successfully!!!',
      data,
    });
  } else {
    const newUser = await Account.createItem(
      email,
      firstname, 
      lastname,
      '',
      avatar,
      1,
    );

    const fcmTokens = await Account.getFcmTokenListOfUser(newUser.userid);  

    const data =  {
      id: newUser.userid,
      email: newUser.email,
      firstName: newUser.firstname,
      lastName: newUser.lastname,
      avatar: newUser.avatar,
      roleID: newUser.roleid,
      fcmTokens: fcmTokens ?? [],
      accessToken: await getJsonWebAccessToken(newUser.userid),
    };

    if (newUser) {
      res.status(200).json({
        message: 'Login with google successfully!!!',
        data,
      });
    } else {
      res.sendStatus(401);
      throw new Error('fafsf');
    }
  }
});

export const removeFcmToken = asyncHandle(async (req: Request, res: Response) => {
  const { userid, fcmtoken } = req.body;

  await UserManager.removeFcmTokenToUser(userid, fcmtoken);

  res.status(200).json({
    message: 'Fcmtoken deleted',
    data: [],
  });
});

export const removeRefreshToken = asyncHandle(async (req: Request, res: Response) => {
  const { userid, deviceid } = req.body;

  await UserManager.removeRefreshTokenOfUser(userid, deviceid);

  res.status(200).json({
    message: 'Refreshtoken deleted',
    data: [],
  });
});