import express from 'express';
import { getOrderByPostID, updateOrderReceiver, createTrace, createOrder, getOrderList, getTrackingStatus, getOrderFinishList, uploadImageConfirmOrder, getOrderDetails, VerifyOrderQR, updateStatusOfOrder, updateTraceStatus } from '../controllers/orderController';
import { updateReceiveID } from '../controllers/orderCollaboratorController';

const router = express.Router();

router.post('/list', getOrderList);
router.post('/listFinish', getOrderFinishList);
router.get('/tracking', getTrackingStatus);
router.post('/upload-image-confirm', uploadImageConfirmOrder);
router.get('/verifyOrderQR', VerifyOrderQR);
router.post('/update-status', updateStatusOfOrder);
router.post('/createOrder', createOrder);
router.post('/createTrace', createTrace);

router.get('/getOrder/:postID', getOrderByPostID);
router.put('/update-receiveid', updateReceiveID);
router.post('/updateOrderReceiver', updateOrderReceiver);
router.post('/updateTraceStatus', updateTraceStatus);
router.get('/:orderID', getOrderDetails);



export default router;
