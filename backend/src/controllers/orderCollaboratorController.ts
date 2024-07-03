import { Request, Response } from 'express';
import { Collaborator } from '../classDiagramModel/Collaborator';
import { User } from '../classDiagramModel/User';

export const getOrdersCollaborator = async (req: Request, res: Response) => {
  const userID = typeof req.query.userID === 'string' ? req.query.userID : undefined;
  const type = typeof req.query.type === 'string' ? req.query.type : undefined;
  const distance = typeof req.query.distance === 'string' ? req.query.distance : undefined;
  const time = typeof req.query.time === 'string' ? req.query.time : undefined;
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const sort = typeof req.query.sort === 'string' ? req.query.sort : undefined;
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  const typeCard = typeof req.query.typeCard === 'string' ? req.query.typeCard : undefined;
  try {
    const orders = await Collaborator.orderManager.showOrders(userID, type, distance, time, category, sort, search, typeCard);
        
    res.status(200).json({ message: 'Get orders successfully', orders: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrdersReceivingCollaborator = async (req: Request, res: Response) => {
  const userID = typeof req.query.userID === 'string' ? req.query.userID : undefined;
  try {
    const orders = await Collaborator.orderManager.showOrdersReceiving(userID);
        
    res.status(201).json({ message: 'Get orders successfully', orders: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  
export const getOrderDetailsCollaborator = async (req: Request, res: Response) => {
  const orderID = typeof req.query.orderID === 'string' ? req.query.orderID : undefined;
  const typeCard = typeof req.query.typeCard === 'string' ? req.query.typeCard : undefined;
  try {
    const orders = await Collaborator.orderManager.showOrderDetails(orderID, typeCard);

    res.status(200).json({ message: 'Get orders successfully', orders: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  
export const statisticOrderCollaborator = async (req: Request, res: Response) => {
  const userID = typeof req.query.userID === 'string' ? req.query.userID : undefined;
  const time = typeof req.query.time === 'string' ? req.query.time : undefined;
  try {
    const statisticOrder = await Collaborator.statistic.statisticOrderCollab(userID, time);
      
    res.status(201).json({ message: 'Get orders successfully', statisticOrder: statisticOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateReceiveID = async (req: Request, res: Response) => {
  const { postID, receiveID, warehouseid } = req.body;
  try {
    const response = await User.orderManager.updateReceiveID(postID, receiveID, warehouseid);
      
    res.status(201).json({ message: 'Get orders successfully', status: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  
export const showOrdersStatistic = async (req: Request, res: Response) => {
  const userID = typeof req.query.userID === 'string' ? req.query.userID : undefined;
  const type = typeof req.query.type === 'string' ? req.query.type : undefined;
  const time = typeof req.query.time === 'string' ? req.query.time : undefined;
  try {
    const orders = await Collaborator.orderManager.showOrdersStatistic(userID, type, time);
      
    res.status(201).json({ message: 'Get orders successfully', orders: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCompleteOrder = async (req: Request, res: Response) => {
  const orderID = req.params.orderID;
  const url = req.body.url;
  try {
    await Collaborator.orderManager.updateCompleteOrder(orderID, url);
      
    res.status(201).json({ message: 'Update status order successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePinOrder = async (req: Request, res: Response) => {
  const orderID = req.params.orderID;
  const collaboratorReceiveID = req.body.collaboratorReceiveID;
  try {
    const response = await Collaborator.orderManager.pinOrder(orderID, collaboratorReceiveID);

    res.status(201).json({ message: 'Update status order successfully', statusPin: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateStatusOrder = async (req: Request, res: Response) => {
  const orderID = req.params.orderID;
  const status = req.body.status;
  try {
    await Collaborator.orderManager.updateStatusOrder(orderID, status);
      
    res.status(201).json({ message: 'Update status order successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
