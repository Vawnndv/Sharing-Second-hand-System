import express from 'express';
import { getWarehouse, getAllWarehouses, getAllWarehousesAllInfo } from '../controllers/warehouseController';



const router = express.Router();

router.get('/getWarehouse/:warehouseid', getWarehouse);
router.get('/', getAllWarehouses);
router.get('/getAllWarehousesAllInfo', getAllWarehousesAllInfo);

export default router;
