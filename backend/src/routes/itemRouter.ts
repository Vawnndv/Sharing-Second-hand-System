import express from 'express';
import {  getItemDetails, getAllItems, postNewItem, getItemImages, getAllItemTypes } from '../controllers/itemController';

const router = express.Router();

router.post('/', postNewItem);
// Route to get all items
router.get('/', getAllItems);

router.get('/types', getAllItemTypes);
router.get('/images/:itemID', getItemImages);
router.get('/:itemID', getItemDetails);


export default router;