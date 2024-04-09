import express from 'express';
import { getAllWarehouses } from '../controllers/warehouseController';



const router = express.Router();


router.get('/', getAllWarehouses);

export default router;
