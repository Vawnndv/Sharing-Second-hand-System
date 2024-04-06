import { Request, Response } from 'express';
import { OrderManager } from '../classDiagramModel/Manager/OrderManager';
import dotenv from 'dotenv';
import asyncHandle from 'express-async-handler';
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

export const uploadImageConfirmOrder = async (req: Request, res: Response) => {
  const { orderid, imgconfirmreceive } = req.body;
  
  try {
    await OrderManager.uploadImageConfirmOrder(orderid, imgconfirmreceive);
    res.status(200).json({ message: 'Update image success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderDetails = asyncHandle(async (req, res) => {
  const orderID: number = parseInt(req.params.orderID);
  try {
    const orderDetails = await OrderManager.getOrderDetails(orderID);
    if (orderDetails) {
      res.status(200).json({ message: 'Get order details success', data: orderDetails });
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    }
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Error:', error);
    res.status(500).json({ message: 'Error network' });
  }
});

export const VerifyOrderQR = asyncHandle(async (req, res) => {
  const orderID : any = req.query.orderID;
  try {
    const result = await  OrderManager.VerifyOrderQR(orderID);
    if (result == null)
      res.status(400).json({ message: 'Not found post or order', data: result });
    res.status(200).json({ message: 'Verify success', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const updateStatusOfOrder = asyncHandle(async (req, res) => {
  const { orderID, statusID } = req.body;
  
  try {
    const result = await OrderManager.updateStatusOfOrder(orderID, statusID);
    if (result)
      res.status(200).json({ message: 'Update success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});