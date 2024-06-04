import express from 'express';
import { getWarehouse, getAllWarehouses, getAllWarehousesAllInfo, getWarehouseNameList, createWarehouse, updateWarehouse } from '../controllers/warehouseController';



const router = express.Router();

router.get('/getWarehouse/:warehouseid', getWarehouse);

router.get('/', getAllWarehouses);

router.get('/warehouse-name-list', getWarehouseNameList);

router.post('/getAllWarehousesAllInfo', getAllWarehousesAllInfo);

router.post('/createWarehouse', createWarehouse);
router.post('/updateWarehouse', updateWarehouse);


export default router;
