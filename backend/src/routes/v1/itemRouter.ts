import express, { Request, Response } from 'express';
import { Item } from '../../classDiagramModel/Item';

const router = express.Router();


router.post('/items', async (req: Request, res: Response) => {
  console.log('lô');
  const { name, quantity, itemtypeID } = req.body;
  
  try {
    const newItem = Item.createItem(name, quantity, itemtypeID);
    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;