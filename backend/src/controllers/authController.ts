import dotenv from 'dotenv';
dotenv.config();
// eslint-disable-next-line import/no-extraneous-dependencies
import asyncHandle from 'express-async-handler';
// eslint-disable-next-line import/no-extraneous-dependencies
import nodemailer from 'nodemailer';
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcrypt';
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import { Account } from '../classDiagramModel/Account';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.USERNAME_EMAIL,
    pass: process.env.PASSWORD,
  },
});

const getJsonWebToken = async (email: string, id: number) => {
  const payload = {
    email, 
    id,
  };
  const secret = process.env.SECRET_KEY;

  // Kiểm tra xem SECRET_KEY đã được định nghĩa hay chưa
  if (!secret) {
    console.error('SECRET_KEY is not defined in environment variables.');
    process.exit(1); // Thoát ứng dụng với mã lỗi 1
  }
  
  // const SECRET_KEY = 'khoahoctunhien';
  const token = jwt.sign(payload, secret, {
    expiresIn: '7d',
  });

  console.log(token);

  return token;
};


const handleSendMail = async (val: {}) => {
  try {
    await transporter.sendMail(val);

    return 'Send verification code successfully!!!';
  } catch (error) {
    return error;
  }
};

export const verification = asyncHandle(async (req, res) => {
  const { email } = req.body;

  const verificationCode = Math.round(1000 + Math.random() * 9000);
  
  try {
    const data = {
      from: '\'Support EvenHub Application\' <$ {process.env.USERNAME_EMAIL}>', 
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

export const register = asyncHandle(async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  const existingUser = await Account.findUserByEmail(email);

  if (existingUser) {
    res.status(401);
    throw new Error('User has already exist!!!');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await Account.createItem(
    username,
    email,
    hashedPassword,
    1,
  );


  res.status(200).json({
    message: 'Register new user successfully',
    data: {
      email,
      id: newUser.userid,
      newUser,  
      accessToken: await getJsonWebToken(email, newUser.userid),
    },
  });
});

export const login = asyncHandle(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await Account.findUserByEmail(email);

  if (!existingUser) {
    res.status(403);
    throw new Error('User not found');
  }

  const isMatchPassword = await bcrypt.compare(password, existingUser.password);

  if (!isMatchPassword) {
    res.status(401);
    throw new Error('Email or Password is not correct!!!');
  }

  res.status(200).json({
    message: 'Login successfully!!!',
    data: {
      id: existingUser.id,
      email: existingUser.email,
      accessToken: await getJsonWebToken(email, existingUser.id),
      roleID: existingUser.roleid,
    },
  });
});

