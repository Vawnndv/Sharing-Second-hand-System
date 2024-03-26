import { Request, Response } from 'express';
import { OrderManager } from '../classDiagramModel/Manager/OrderManager';
import dotenv from 'dotenv';
dotenv.config();

export const getOrderList = async (req: Request, res: Response) => {
  const { userID } = req.body;
  
  try {
    const orderList = await  OrderManager.getOrderList(userID);
    res.status(200).json({ message: 'Get orders list success:', data: orderList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderFinishList = async (req: Request, res: Response) => {
  const { userID } = req.body;
  
  try {
    const orderListFinish = await  OrderManager.getOrderFinishList(userID);
    res.status(200).json({ message: 'Get orders finish list success:', data: orderListFinish });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTrackingStatus = async (req: Request, res: Response) => {
  const { orderID } = req.body;
  
  try {
    const trackingList = await  OrderManager.getTrackingOrderByID(orderID);
    res.status(200).json({ message: 'Get tracking list success:', data: trackingList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};