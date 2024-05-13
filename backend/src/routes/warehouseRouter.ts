import express from 'express';
import { getWarehouse, getAllWarehouses, getAllWarehousesAllInfo, getWarehouseNameList } from '../controllers/warehouseController';



const router = express.Router();

router.get('/getWarehouse/:warehouseid', getWarehouse);

router.get('/', getAllWarehouses);

router.get('/warehouse-name-list', getWarehouseNameList);

router.get('/getAllWarehousesAllInfo', getAllWarehousesAllInfo);

export default router;
