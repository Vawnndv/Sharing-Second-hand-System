import express from 'express';
import { createTrace, createOrder, getOrderList, getTrackingStatus, getOrderFinishList, uploadImageConfirmOrder, getOrderDetails, VerifyOrderQR, updateStatusOfOrder } from '../controllers/orderController';
import { updateReceiveID } from '../controllers/orderCollaboratorController';

const router = express.Router();

router.get('/list', getOrderList);
router.get('/listFinish', getOrderFinishList);
router.get('/tracking', getTrackingStatus);
router.post('/upload-image-confirm', uploadImageConfirmOrder);
router.get('/verifyOrderQR', VerifyOrderQR);
router.post('/update-status', updateStatusOfOrder);
router.get('/:orderID', getOrderDetails);
router.post('/createOrder', createOrder);
router.post('/createTrace', createTrace);

router.put('/update-receiveid', updateReceiveID);

export default router;
