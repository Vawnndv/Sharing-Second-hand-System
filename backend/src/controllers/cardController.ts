import asyncHandle from 'express-async-handler';
import { Collaborator } from '../classDiagramModel/Collaborator';


export const createInputCard = asyncHandle(async (req, res) => {
  const { qrcode, warehouseid, usergiveid, orderid, itemid } = req.body;

  
  try {
    const newInputCard = await Collaborator.cardManager.createCardInput(qrcode, warehouseid, usergiveid, orderid, itemid);
    res.status(201).json({ message: 'Card input created successfully', card: newInputCard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const createOutputCard = asyncHandle(async (req, res) => {
  const { warehouseid, userreceiveid, orderid, itemid } = req.body;

  
  try {
    const newInputCard = await Collaborator.cardManager.createCardOutput(warehouseid, userreceiveid, orderid, itemid);
    res.status(201).json({ message: 'Card input created successfully', card: newInputCard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

