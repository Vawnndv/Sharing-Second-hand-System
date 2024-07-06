import dotenv from 'dotenv';
dotenv.config();
import asyncHandle from 'express-async-handler';
import { Request, Response } from 'express';
import { User } from '../classDiagramModel/User';

export const insertRating = asyncHandle(async (req: Request, res: Response) => {
  const { userGiveID, orderID, rate } = req.body;
  
  try {
    const result = await User.ratingManager.insertRating(userGiveID, orderID, rate);
    if (result)
      res.status(200).json({ message: 'Insert Rating Successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const getRating = asyncHandle(async (req: Request, res: Response) => {
  const userID: any = req.query.userID;
    
  try {
    const result = await User.ratingManager.getRating(userID);
    if (result)
      res.status(200).json({ message: 'Get Rating Successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});