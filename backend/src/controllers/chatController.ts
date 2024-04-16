import { Request, Response } from 'express';
import { ChatManager } from '../classDiagramModel/Manager/ChatManager';
import dotenv from 'dotenv';
dotenv.config();

export const getUserChatList = async (req: Request, res: Response) => {
  const userID : any = req.query.userID;
  
  try {
    const userList = await ChatManager.getUserChatList(userID);
    res.status(200).json({ message: 'Get users list success:', data: userList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};