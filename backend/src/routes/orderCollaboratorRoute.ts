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

const router = express.Router();

router.get('/ordersCollab', getOrdersCollaborator); 

router.get('/ordersCollab/receiving', getOrdersReceivingCollaborator); 

router.get('/orderDetailsCollab', getOrderDetailsCollaborator); 

router.get('/statisticOrderCollab', statisticOrderCollaborator); 

router.get('/showOrdersStatistic', showOrdersStatistic); 

router.put('/updateCompleteOrder/:orderID', updateCompleteOrder);

router.put('/updatePinOrder/:orderID', updatePinOrder);

router.put('/updateStatusOrder/:orderID', updateStatusOrder);

export default router;