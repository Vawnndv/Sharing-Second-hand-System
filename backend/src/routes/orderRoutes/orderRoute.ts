import express, { Request, Response } from 'express';
import { OrderManager } from '../../classDiagramModel/Manager/OrderManager';
import { StatisticManager } from '../../classDiagramModel/Manager/StatisticManager';

const router = express.Router();

router.get('/ordersCollab', async (req: Request, res: Response) => {
  const userID = typeof req.query.userID === 'string' ? req.query.userID : undefined;
  const type = typeof req.query.type === 'string' ? req.query.type : undefined;
  console.log(userID, type);
  try {
    const orders = await OrderManager.showOrders(userID, type);
    
    res.status(201).json({ message: 'Get orders successfully', orders: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/orderDetailsCollab', async (req: Request, res: Response) => {
  const orderID = typeof req.query.orderID === 'string' ? req.query.orderID : undefined;
  console.log(orderID);
  try {
    const orders = await OrderManager.showOrderDetails(orderID);
    
    res.status(201).json({ message: 'Get orders successfully', orders: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/statisticOrderCollab', async (req: Request, res: Response) => {
  const userID = typeof req.query.userID === 'string' ? req.query.userID : undefined;
  
  console.log(userID);
  try {
    const statisticOrder = await StatisticManager.statisticOrderCollab(userID);
    
    res.status(201).json({ message: 'Get orders successfully', statisticOrder: statisticOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/statisticOrdersOnWeekCollab', async (req: Request, res: Response) => {
  const userID = typeof req.query.userID === 'string' ? req.query.userID : undefined;
  
  console.log(userID);
  try {
    const ordersOnWeek = await OrderManager.showOrdersOnWeek(userID);
    
    res.status(201).json({ message: 'Get orders successfully', ordersOnWeek: ordersOnWeek });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;