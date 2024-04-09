import express from 'express';
import {  getItemDetails, getAllItems, postNewItem, getItemImages, getAllItemTypes } from '../controllers/itemController';

const router = express.Router();

router.post('/items', postNewItem);

// Route to get all items
router.get('/items', getAllItems);

router.get('/items/:itemID', getItemDetails);
router.get('/items/images/:itemID', getItemImages);
router.get('/types', getAllItemTypes);


export default router;