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

export const createNewChat = async (req: Request, res: Response) => {
  const { firstuserid, seconduserid, postid } = req.body;
  
  try {
    const result = await ChatManager.createNewChat(firstuserid, seconduserid, postid);
    if (result)
      res.status(200).json({ message: 'Create new chat success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserChatListUser = async (req: Request, res: Response) => {
  const userID : any = req.query.userID;
  
  try {
    const userList = await ChatManager.getUserChatListUser(userID);
    res.status(200).json({ message: 'Get users list success:', data: userList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getChatListCollaborator = async (req: Request, res: Response) => {
  const userID : any = req.query.userID;
  
  try {
    const userList = await ChatManager.getChatListCollaborator(userID);
    res.status(200).json({ message: 'Get list success:', data: userList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getChatListUser = async (req: Request, res: Response) => {
  const userID : any = req.query.userID;
  
  try {
    const userList = await ChatManager.getChatListUser(userID);
    res.status(200).json({ message: 'Get list success:', data: userList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getChatWarehouse = async (req: Request, res: Response) => {
  const userID : any = req.query.userID;
  
  try {
    const userList = await ChatManager.getChatWarehouse(userID);
    res.status(200).json({ message: 'Get list success:', data: userList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createNewChatUser = async (req: Request, res: Response) => {
  const { firstuserid, seconduserid } = req.body;
  
  try {
    const result = await ChatManager.createNewChatUser(firstuserid, seconduserid);
    if (result)
      res.status(200).json({ message: 'Create new chat success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};