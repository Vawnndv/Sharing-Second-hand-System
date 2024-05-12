import express from 'express';
import { getWarehouse, getAllWarehouses, getAllWarehousesAllInfo, createWarehouse, updateWarehouse } from '../controllers/warehouseController';



const router = express.Router();

router.get('/getWarehouse/:warehouseid', getWarehouse);
router.get('/', getAllWarehouses);
router.get('/getAllWarehousesAllInfo', getAllWarehousesAllInfo);

router.post('/createWarehouse', createWarehouse);
router.post('/updateWarehouse', updateWarehouse);


export default router;
