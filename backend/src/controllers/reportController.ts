import dotenv from 'dotenv';
dotenv.config();
import asyncHandle from 'express-async-handler';
import { Request, Response } from 'express';
import { User } from '../classDiagramModel/User';

export const insertReport = asyncHandle(async (req: Request, res: Response) => {
  const { userID, postID, reportType, description, reporterID, warehouseID } = req.body;
  
  try {
    const result = await User.reportManager.insertReport(userID, postID, reportType, description, reporterID, warehouseID);
    if (result)
      res.status(200).json({ message: 'Insert Report Successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const getUserReports = asyncHandle(async (req: Request, res: Response) => {
  try {
    const result = await User.reportManager.getUserReports();
    if (result)
      res.status(200).json({ message: 'Get Report Successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const getPostReports = asyncHandle(async (req: Request, res: Response) => {
  try {
    const userID: any = req.query.userID;
    const result = await User.reportManager.getPostReports(userID);
    if (result)
      res.status(200).json({ message: 'Get Report Successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const updateReport = asyncHandle(async (req: Request, res: Response) => {
  const { reportID } = req.body;
  try {
    const result = await User.reportManager.updateReport(reportID);
    if (result)
      res.status(200).json({ message: 'Update Report Successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
  