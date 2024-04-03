import express from 'express';
import { getOrderList, getTrackingStatus, getOrderFinishList } from '../controllers/orderController';

const router = express.Router();

router.get('/list', getOrderList);
router.get('/listFinish', getOrderFinishList);
router.get('/tracking', getTrackingStatus);

export default router;
