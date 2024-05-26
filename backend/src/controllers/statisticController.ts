import { Request, Response } from 'express';
import { StatisticManager } from '../classDiagramModel/Manager/StatisticManager';
  
export const statisticImportExport = async (req: Request, res: Response) => {
  const { type, userID, timeStart, timeEnd } = req.body;
  try {
    const results = await StatisticManager.statisticImportExport(userID, type, timeStart, timeEnd);
      
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
  const timeValue = typeof req.query.timeValue === 'string' ? req.query.timeValue : undefined;
  let newTimeValue: number = -1;
  if (timeValue !== undefined) {
    newTimeValue = parseInt(timeValue);
  } 
  try {
    const results = await StatisticManager.statisticAccessUser(newTimeValue);
        
    res.status(201).json({ message: 'Get orders successfully', data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const statisticImportExportAdmin = async (req: Request, res: Response) => {
  const { type, warehouses, timeStart, timeEnd } = req.body;
  try {
    const results = await StatisticManager.statisticImportExportAdmin(type, warehouses, timeStart, timeEnd);
      
    res.status(201).json({ message: 'Get orders successfully', data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const statisticImportExportFollowTimeAdmin = async (req: Request, res: Response) => {
  const { type, category, warehouses, timeStart, timeEnd } = req.body;
  try {
    const results = await StatisticManager.statisticImportExportFollowTimeAdmin(type, category, warehouses, timeStart, timeEnd);
      
    res.status(201).json({ message: 'Get Statistic successfully', data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const statisticInventoryAdmin = async (req: Request, res: Response) => {
  const { warehouses } = req.body;
  try {
    const results = await StatisticManager.statisticInventoryAdmin(warehouses);
        
    res.status(201).json({ message: 'Get orders successfully', data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const statisticAccessUserAdmin = async (req: Request, res: Response) => {
  const { timeValue, warehouses } = req.body;
  let newTimeValue: number = -1;
  if (timeValue !== undefined) {
    newTimeValue = parseInt(timeValue);
  } 
  try {
    const results = await StatisticManager.statisticAccessUserAdmin(newTimeValue, warehouses);
        
    res.status(201).json({ message: 'Get orders successfully', data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






