import { AuthenticatedRequest } from '../types/types';
import dotenv from 'dotenv';
dotenv.config();
import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { Account } from '../classDiagramModel/Account';
import { Response, NextFunction } from 'express';

const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    } else {
      const secretKey = process.env.ACCESS_TOKEN_KEY;
      if (!secretKey) {
        return res.status(500).json({ message: 'Secret key is not defined' });
      }

      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Not authorized, invalid token' });
        }

        if (decoded && typeof decoded !== 'string' && (decoded as JwtPayload).id) {
          const user = await Account.findUserById((decoded as JwtPayload).id);
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }

          if (user.isbanned) {
            return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa' });
          }

          if (!user.email) {
            return res.status(403).json({ message: 'Tài khoản của bạn đã bị xóa' });
          }
          
          req.user = user;
          next();
        } else {
          return res.status(403).json({ message: 'Not authorized, invalid token' });
        }
      });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = asyncHandler((req: AuthenticatedRequest, res, next) => {
  if (req.user && req.user.roleid === 3) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
});

const collaborator = asyncHandler((req: AuthenticatedRequest, res, next) => {
  if (req.user && req.user.roleid === 2) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an collaborator');
  }
});

export { protect, admin, collaborator };
