import express from 'express';
import { getItemDetails, getAllItems, postNewItem, getItemImages, getAllItemTypes, postImageItem } from '../controllers/itemController';
import { protect } from '../middlewares/verifyMiddleware';

const router = express.Router();

router.post('/', protect, postNewItem);
// Route to get all items
router.get('/', protect, getAllItems);

router.get('/types', protect, getAllItemTypes);
router.get('/images/:itemID', protect, getItemImages);
router.get('/:itemID', protect, getItemDetails);
router.post('/upload-image', protect, postImageItem);


export default router;