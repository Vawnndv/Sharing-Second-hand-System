import asyncHandle from 'express-async-handler';
import { CardManager } from '../classDiagramModel/Manager/CardManager';

export const createInputCard = asyncHandle(async (req, res) => {
  const { qrcode, warehouseid, usergiveid, orderid, itemid } = req.body;
  
  try {
    const newInputCard = await CardManager.createCardInput(qrcode, warehouseid, usergiveid, orderid, itemid);
    res.status(201).json({ message: 'Card input created successfully', card: newInputCard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

