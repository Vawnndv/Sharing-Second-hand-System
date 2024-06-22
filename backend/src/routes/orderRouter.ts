import express from 'express';
import { getOrderByPostID, updateOrderReceiver, createTrace, createOrder, getOrderList, getTrackingStatus, getOrderFinishList, uploadImageConfirmOrder, getOrderDetails, VerifyOrderQR, updateStatusOfOrder, updateTraceStatus, getOrderListReceive, getOrderListByStatus } from '../controllers/orderController';
import { updateReceiveID } from '../controllers/orderCollaboratorController';
import { protect } from '../middlewares/verifyMiddleware';

const router = express.Router();

router.post('/list', protect, getOrderList);
router.post('/listReceive', protect, getOrderListReceive);
router.post('/listFinish', protect, getOrderFinishList);

router.post('/listOrders', protect, getOrderListByStatus);

router.get('/tracking', protect, getTrackingStatus);
router.post('/upload-image-confirm', protect, uploadImageConfirmOrder);
router.get('/verifyOrderQR', protect, VerifyOrderQR);
router.post('/update-status', protect, updateStatusOfOrder);
router.post('/createOrder', protect, createOrder);
router.post('/createTrace', protect, createTrace);

router.get('/getOrder/:postID', protect, getOrderByPostID);
router.put('/update-receiveid', protect, updateReceiveID);
router.post('/updateOrderReceiver', protect, updateOrderReceiver);
router.post('/updateTraceStatus', protect, updateTraceStatus);
router.get('/:orderID', protect, getOrderDetails);



export default router;
