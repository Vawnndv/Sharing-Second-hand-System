import { Request, Response } from 'express';
import { OrderManager } from '../classDiagramModel/Manager/OrderManager';
import dotenv from 'dotenv';
dotenv.config();

export const getOrderList = async (req: Request, res: Response) => {
  const userID : any = req.query.userID;
  const distance : any = req.query.distance;
  const time : any = req.query.time;
  const category : any = req.query.category;
  const sort : any = req.query.sort;
  const latitude : any = req.query.latitude;
  const longitude : any = req.query.longitude;
  
  try {
    const orderList = await  OrderManager.getOrderList(userID, distance, time, category, sort, latitude, longitude);
    res.status(200).json({ message: 'Get orders list success:', data: orderList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderFinishList = async (req: Request, res: Response) => {
  const userID : any = req.query.userID;
  const distance : any = req.query.distance;
  const time : any = req.query.time;
  const category : any = req.query.category;
  const sort : any = req.query.sort;
  const latitude : any = req.query.latitude;
  const longitude : any = req.query.longitude;
  
  try {
    const orderListFinish = await  OrderManager.getOrderFinishList(userID, distance, time, category, sort, latitude, longitude);
    res.status(200).json({ message: 'Get orders finish list success:', data: orderListFinish });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTrackingStatus = async (req: Request, res: Response) => {
  const orderID : any = req.query.orderID;
  
  try {
    const trackingList = await  OrderManager.getTrackingOrderByID(orderID);
    res.status(200).json({ message: 'Get tracking list success:', data: trackingList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};