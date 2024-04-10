import express from 'express';
import { getOrderByPostID, updateOrderReceiver, createTrace, createOrder, getOrderList, getTrackingStatus, getOrderFinishList, uploadImageConfirmOrder, getOrderDetails, VerifyOrderQR, updateStatusOfOrder } from '../controllers/orderController';
import { updateReceiveID } from '../controllers/orderCollaboratorController';

const router = express.Router();

router.get('/list', getOrderList);
router.get('/listFinish', getOrderFinishList);
router.get('/tracking', getTrackingStatus);
router.post('/upload-image-confirm', uploadImageConfirmOrder);
router.get('/verifyOrderQR', VerifyOrderQR);
router.post('/update-status', updateStatusOfOrder);
router.post('/createOrder', createOrder);
router.post('/createTrace', createTrace);

router.get('/getOrder/:postID', getOrderByPostID);
router.put('/update-receiveid', updateReceiveID);
router.post('/updateOrderReceiver', updateOrderReceiver);
router.get('/:orderID', getOrderDetails);



export default router;
