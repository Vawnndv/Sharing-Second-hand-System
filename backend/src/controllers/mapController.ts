import { Request, Response } from 'express';
import { MapManager } from '../classDiagramModel/Manager/MapManager';

export const setUserLocation = async (req: Request, res: Response) => {

  const { userID, latitude, longitude, address } = req.body;
  try {
    const resultSetUserLocation = await MapManager.setUserLocation(userID, latitude, longitude, address);
        
    res.status(201).json({ message: 'Get orders successfully', result: resultSetUserLocation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

