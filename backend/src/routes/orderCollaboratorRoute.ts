import express from 'express';
import {
  getOrdersCollaborator,
  getOrderDetailsCollaborator,
  statisticOrderCollaborator,
  getStatisticOrderOnWeek,
  updateStatusOrder,
} from '../controllers/orderCollaboratorController';

const router = express.Router();

router.get('/ordersCollab', getOrdersCollaborator); 

router.get('/orderDetailsCollab', getOrderDetailsCollaborator); 

router.get('/statisticOrderCollab', statisticOrderCollaborator); 

router.get('/statisticOrdersOnWeekCollab', getStatisticOrderOnWeek); 

router.put('/updateStatusOrder/:orderID', updateStatusOrder);

export default router;