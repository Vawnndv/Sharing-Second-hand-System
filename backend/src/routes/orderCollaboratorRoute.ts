import express from 'express';
import {
  getOrdersCollaborator,
  getOrderDetailsCollaborator,
  statisticOrderCollaborator,
  // getStatisticOrderOnWeek,
  updateStatusOrder,
  getOrdersReceivingCollaborator,
  updatePinOrder,
  updateCompleteOrder,
  showOrdersStatistic,
} from '../controllers/orderCollaboratorController';
import { protect } from '../middlewares/verifyMiddleware';

const router = express.Router();

router.get('/ordersCollab', protect, getOrdersCollaborator); 

router.get('/ordersCollab/receiving', protect, getOrdersReceivingCollaborator); 

router.get('/orderDetailsCollab', protect, getOrderDetailsCollaborator); 

router.get('/statisticOrderCollab', protect, statisticOrderCollaborator); 

router.get('/showOrdersStatistic', protect, showOrdersStatistic); 

router.put('/updateCompleteOrder/:orderID', protect, updateCompleteOrder);

router.put('/updatePinOrder/:orderID', protect, updatePinOrder);

router.put('/updateStatusOrder/:orderID', protect, updateStatusOrder);

export default router;