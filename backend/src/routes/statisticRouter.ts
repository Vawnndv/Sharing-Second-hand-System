import express from 'express';
import { statisticImportExport, statisticInventory, statisticAccessUser, statisticImportExportAdmin, statisticInventoryAdmin, statisticImportExportFollowTimeAdmin, statisticAccessUserAdmin } from '../controllers/statisticController';

const router = express.Router();

router.post('/statisticImportExport', statisticImportExport);
router.get('/statisticInventory', statisticInventory);
router.get('/statisticAccessUser', statisticAccessUser);
router.post('/statisticAccessUserAdmin', statisticAccessUserAdmin);
router.post('/statisticImportExportAdmin', statisticImportExportAdmin);
router.post('/statisticImportExportFollowTimeAdmin', statisticImportExportFollowTimeAdmin);
router.post('/statisticInventoryAdmin', statisticInventoryAdmin);

export default router;
