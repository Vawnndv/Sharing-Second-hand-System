import dotenv from 'dotenv';
dotenv.config();
import asyncHandle from 'express-async-handler';
import { Request, Response } from 'express';
import { ReportManager } from '../classDiagramModel/Manager/ReportManager';

export const insertReport = asyncHandle(async (req: Request, res: Response) => {
  const { userID, postID, reportType, description, reporterID } = req.body;
  
  try {
    const result = await ReportManager.insertReport(userID, postID, reportType, description, reporterID);
    if (result)
      res.status(200).json({ message: 'Insert Report Successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const getUserReports = asyncHandle(async (req: Request, res: Response) => {
  try {
    const result = await ReportManager.getUserReports();
    if (result)
      res.status(200).json({ message: 'Get Report Successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const getPostReports = asyncHandle(async (req: Request, res: Response) => {
  try {
    const result = await ReportManager.getPostReports();
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
    const result = await ReportManager.updateReport(reportID);
    if (result)
      res.status(200).json({ message: 'Update Report Successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
  