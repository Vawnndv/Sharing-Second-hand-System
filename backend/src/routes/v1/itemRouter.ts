import express, { Request, Response } from 'express';
import { ItemManager } from '../../classDiagramModel/Manager/ItemManager';
import { Item } from '../../classDiagramModel//Item';

import {  getItemDetails } from '../../controllers/itemController';



const router = express.Router();


router.post('/items', async (req: Request, res: Response) => {
  const { name, quantity, itemtypeID } = req.body;
  
  try {
    const newItem = ItemManager.createItem(name, quantity, itemtypeID);
    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route to get all items
router.get('/items', async (req: Request, res: Response) => {
  try {
    // Call the static method getAllItems to fetch all items from the database
    const items = await Item.getAllItems();
    // If items are found, return them as a response
    if (items) {
      res.status(200).json(items);
    } else {
      // If no items are found, return an empty array
      res.status(200).json([]);
    }
  } catch (error) {
    // If there's an error, return a 500 error
    console.error('Error retrieving items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/items/:itemID', getItemDetails);

export default router;