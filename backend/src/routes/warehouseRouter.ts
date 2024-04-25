import express from 'express';
import { getWarehouse, getAllWarehouses } from '../controllers/warehouseController';



const router = express.Router();

router.get('/getWarehouse/:warehouseid', getWarehouse);
router.get('/', getAllWarehouses);

export default router;
