import dotenv from 'dotenv';
dotenv.config();
import asyncHandle from 'express-async-handler';
import { Request, Response } from 'express';
import { ReportManager } from '../classDiagramModel/Manager/ReportManager';

export const insertReport = asyncHandle(async (req: Request, res: Response) => {
  const { userID, postID, reportType, description } = req.body;
  
  try {
    const result = await ReportManager.insertReport(userID, postID, reportType, description);
    if (result)
      res.status(200).json({ message: 'Insert Report Successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
    
  
  
});
  