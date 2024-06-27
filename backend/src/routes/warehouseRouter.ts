import express from 'express';
import { getWarehouse, getAllWarehouses, getAllWarehousesAllInfo, getWarehouseNameList, createWarehouse, updateWarehouse, updateWarehouseStatus, getAllWarehousesAdmin } from '../controllers/warehouseController';
import { protect } from '../middlewares/verifyMiddleware';

const router = express.Router();

router.get('/getWarehouse/:warehouseid', protect, getWarehouse);

router.get('/', protect, getAllWarehouses);

router.get('/admin', protect, getAllWarehousesAdmin);


router.get('/warehouse-name-list', protect, getWarehouseNameList);

router.post('/getAllWarehousesAllInfo', protect, getAllWarehousesAllInfo);

router.post('/createWarehouse', protect, createWarehouse);
router.post('/updateWarehouse', protect, updateWarehouse);
router.post('/updateWarehouseStatus', protect, updateWarehouseStatus);



export default router;
