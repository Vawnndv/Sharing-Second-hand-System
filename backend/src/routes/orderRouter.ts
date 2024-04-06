import express from 'express';
import { getOrderList, getTrackingStatus, getOrderFinishList, uploadImageConfirmOrder, getOrderDetails } from '../controllers/orderController';

const router = express.Router();

router.get('/list', getOrderList);
router.get('/listFinish', getOrderFinishList);
router.get('/tracking', getTrackingStatus);
router.post('/upload-image-confirm', uploadImageConfirmOrder);
router.get('/:orderID', getOrderDetails);

export default router;
