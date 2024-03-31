import { Request, Response } from 'express';
import { OrderManager } from '../classDiagramModel/Manager/OrderManager';
import { StatisticManager } from '../classDiagramModel/Manager/StatisticManager';

export const getOrdersCollaborator = async (req: Request, res: Response) => {
  const userID = typeof req.query.userID === 'string' ? req.query.userID : undefined;
  const type = typeof req.query.type === 'string' ? req.query.type : undefined;
  try {
    const orders = await OrderManager.showOrders(userID, type);
        
    res.status(201).json({ message: 'Get orders successfully', orders: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  
export const getOrderDetailsCollaborator = async (req: Request, res: Response) => {
  const orderID = typeof req.query.orderID === 'string' ? req.query.orderID : undefined;
  try {
    const orders = await OrderManager.showOrderDetails(orderID);
      
    res.status(201).json({ message: 'Get orders successfully', orders: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  
export const statisticOrderCollaborator = async (req: Request, res: Response) => {
  const userID = typeof req.query.userID === 'string' ? req.query.userID : undefined;
  try {
    const statisticOrder = await StatisticManager.statisticOrderCollab(userID);
      
    res.status(201).json({ message: 'Get orders successfully', statisticOrder: statisticOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  
export const getStatisticOrderOnWeek = async (req: Request, res: Response) => {
  const userID = typeof req.query.userID === 'string' ? req.query.userID : undefined;
  try {
    const ordersOnWeek = await OrderManager.showOrdersOnWeek(userID);
      
    res.status(201).json({ message: 'Get orders successfully', ordersOnWeek: ordersOnWeek });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateStatusOrder = async (req: Request, res: Response) => {
  const orderID = req.params.orderID;
  try {
    await OrderManager.updateStatusOrder(orderID);
      
    res.status(201).json({ message: 'Update status order successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
