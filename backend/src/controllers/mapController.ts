import { Request, Response } from 'express';
import { User } from '../classDiagramModel/User';

export const setUserLocation = async (req: Request, res: Response) => {

  const { userID, latitude, longitude, address } = req.body;
  try {
    const resultSetUserLocation = await User.mapManager.setUserLocation(userID, latitude, longitude, address);
        
    res.status(201).json({ message: 'Get orders successfully', result: resultSetUserLocation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

