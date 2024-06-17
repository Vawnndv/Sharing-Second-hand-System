import express from 'express';
import { statisticImportExport, statisticInventory, statisticAccessUser, statisticImportExportAdmin, statisticInventoryAdmin, statisticImportExportFollowTimeAdmin, statisticAccessUserAdmin, insertAnalytic } from '../controllers/statisticController';
import { protect } from '../middlewares/verifyMiddleware';


const router = express.Router();

router.post('/statisticImportExport', protect, statisticImportExport);
router.get('/statisticInventory', protect, statisticInventory);
router.post('/statisticAccessUser', protect, statisticAccessUser);
router.post('/statisticAccessUserAdmin', protect, statisticAccessUserAdmin);
router.post('/statisticImportExportAdmin', protect, statisticImportExportAdmin);
router.post('/statisticImportExportFollowTimeAdmin', protect, statisticImportExportFollowTimeAdmin);
router.post('/statisticInventoryAdmin', protect, statisticInventoryAdmin);
router.post('/statisticInventoryAdmin', protect, statisticInventoryAdmin);
router.post('/insertAnalytic', protect, insertAnalytic);
export default router;
