import express from 'express';
import { getWarehouse, getAllWarehouses, getAllWarehousesAllInfo, getWarehouseNameList, createWarehouse, updateWarehouse, updateWarehouseStatus } from '../controllers/warehouseController';



const router = express.Router();

router.get('/getWarehouse/:warehouseid', getWarehouse);

router.get('/', getAllWarehouses);

router.get('/warehouse-name-list', getWarehouseNameList);

router.post('/getAllWarehousesAllInfo', getAllWarehousesAllInfo);

router.post('/createWarehouse', createWarehouse);
router.post('/updateWarehouse', updateWarehouse);
router.post('/updateWarehouseStatus', updateWarehouseStatus);



export default router;
