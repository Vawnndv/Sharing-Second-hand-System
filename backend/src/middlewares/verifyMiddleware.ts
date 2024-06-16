import { AuthenticatedRequest } from '../types/types';
import dotenv from 'dotenv';
dotenv.config();
import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { Account } from '../classDiagramModel/Account';
import { Response, NextFunction } from 'express';

const protect = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  console.log(req.headers.authorization);
  if (
    req.headers.authorization 
    // && req.headers.authorization.startsWith('Bearer')
  ) {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
    } else {
      try {
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
          throw new Error('Secret key is not defined');
        }

        const verify = jwt.verify(token, secretKey);

        if (typeof verify !== 'string' && (verify as JwtPayload).id) {
          const payload = verify as JwtPayload;
          req.user = await Account.findUserById(payload.id);
          console.log(req.user);
          next();
        } else {
          res.status(401);
          throw new Error('Not authorized, invalid token');
        }
      } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = asyncHandler((req: AuthenticatedRequest, res, next) => {
  if (req.user && req.user.roleId === 3) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
});

const collaborator = asyncHandler((req: AuthenticatedRequest, res, next) => {
  if (req.user && req.user.roleId === 2) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an collaborator');
  }
});

export { protect, admin, collaborator };
