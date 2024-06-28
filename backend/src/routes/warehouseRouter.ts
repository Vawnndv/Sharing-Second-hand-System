import express from 'express';
import { getWarehouse, getAllWarehouses, getAllWarehousesAllInfo, getWarehouseNameList, createWarehouse, updateWarehouse, updateWarehouseStatus, getWarehouseByUserID } from '../controllers/warehouseController';
import { protect } from '../middlewares/verifyMiddleware';

const router = express.Router();

router.get('/getWarehouse/:warehouseid', protect, getWarehouse);
router.get('/getWarehouseByUserID/:userid', protect, getWarehouseByUserID);

router.get('/', protect, getAllWarehouses);

router.get('/warehouse-name-list', protect, getWarehouseNameList);

router.post('/getAllWarehousesAllInfo', protect, getAllWarehousesAllInfo);

router.post('/createWarehouse', protect, createWarehouse);
router.post('/updateWarehouse', protect, updateWarehouse);
router.post('/updateWarehouseStatus', protect, updateWarehouseStatus);



export default router;
