import { Request, Response } from 'express';
import { StatisticManager } from '../classDiagramModel/Manager/StatisticManager';
  
export const statisticImportExport = async (req: Request, res: Response) => {
  const userID = typeof req.query.userID === 'string' ? req.query.userID : undefined;
  const type = typeof req.query.type === 'string' ? req.query.type : undefined;
  try {
    const results = await StatisticManager.statisticImportExport(userID, type);
      
    res.status(201).json({ message: 'Get orders successfully', data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const statisticInventory = async (req: Request, res: Response) => {
  const userID = typeof req.query.userID === 'string' ? req.query.userID : undefined;
  try {
    const results = await StatisticManager.statisticInventory(userID);
        
    res.status(201).json({ message: 'Get orders successfully', data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const statisticAccessUser = async (req: Request, res: Response) => {
  const userID = typeof req.query.userID === 'string' ? req.query.userID : undefined;
  const timeValue = typeof req.query.timeValue === 'string' ? req.query.timeValue : undefined;
  let newTimeValue: number = -1;
  if (timeValue !== undefined) {
    newTimeValue = parseInt(timeValue);
  } 
  try {
    const results = await StatisticManager.statisticAccessUser(userID, newTimeValue);
        
    res.status(201).json({ message: 'Get orders successfully', data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





