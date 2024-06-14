import express from 'express';
import { statisticImportExport, statisticInventory, statisticAccessUser, statisticImportExportAdmin, statisticInventoryAdmin, statisticImportExportFollowTimeAdmin, statisticAccessUserAdmin, insertAnalytic } from '../controllers/statisticController';

const router = express.Router();

router.post('/statisticImportExport', statisticImportExport);
router.get('/statisticInventory', statisticInventory);
router.post('/statisticAccessUser', statisticAccessUser);
router.post('/statisticAccessUserAdmin', statisticAccessUserAdmin);
router.post('/statisticImportExportAdmin', statisticImportExportAdmin);
router.post('/statisticImportExportFollowTimeAdmin', statisticImportExportFollowTimeAdmin);
router.post('/statisticInventoryAdmin', statisticInventoryAdmin);
router.post('/statisticInventoryAdmin', statisticInventoryAdmin);
router.post('/insertAnalytic', insertAnalytic);
export default router;
