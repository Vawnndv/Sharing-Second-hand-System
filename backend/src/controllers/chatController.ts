import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Account } from '../classDiagramModel/Account';
dotenv.config();

export const getUserChatList = async (req: Request, res: Response) => {
  const userID : any = req.query.userID;
  
  try {
    const userList = await Account.chatManager.getUserChatList(userID);
    res.status(200).json({ message: 'Get users list success:', data: userList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createNewChat = async (req: Request, res: Response) => {
  const { firstuserid, seconduserid, postid } = req.body;
  
  try {
    const result = await Account.chatManager.createNewChat(firstuserid, seconduserid, postid);
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
    const userList = await Account.chatManager.getUserChatListUser(userID);
    res.status(200).json({ message: 'Get users list success:', data: userList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getChatListCollaborator = async (req: Request, res: Response) => {
  const userID : any = req.query.userID;
  const searchQuery : any = req.query.searchQuery;
  
  try {
    const userList = await Account.chatManager.getChatListCollaborator(userID, searchQuery);
    res.status(200).json({ message: 'Get list success:', data: userList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllChatListCollaborator = async (req: Request, res: Response) => {
  const userID : any = req.query.userID;
  const searchQuery : any = req.query.searchQuery;
  
  try {
    const userList = await Account.chatManager.getAllChatListCollaborator(userID, searchQuery);
    res.status(200).json({ message: 'Get list success:', data: userList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getChatListUser = async (req: Request, res: Response) => {
  const userID : any = req.query.userID;
  const searchQuery : any = req.query.searchQuery;
  
  try {
    const userList = await Account.chatManager.getChatListUser(userID, searchQuery);
    res.status(200).json({ message: 'Get list success:', data: userList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getChatWarehouse = async (req: Request, res: Response) => {
  const userID : any = req.query.userID;
  
  try {
    const userList = await Account.chatManager.getChatWarehouse(userID);
    res.status(200).json({ message: 'Get list success:', data: userList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createNewChatUser = async (req: Request, res: Response) => {
  const { firstuserid, seconduserid } = req.body;
  
  try {
    const result = await Account.chatManager.createNewChatUser(firstuserid, seconduserid);
    if (result)
      res.status(200).json({ message: 'Create new chat success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getWareHouseByUserID = async (req: Request, res: Response) => {
  const userID : any = req.query.userID;
  
  try {
    const userList = await Account.chatManager.getWareHouseByUserID(userID);
    res.status(200).json({ message: 'Get list success:', data: userList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};