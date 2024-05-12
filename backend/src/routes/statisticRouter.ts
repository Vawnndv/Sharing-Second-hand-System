import express from 'express';
import { statisticImportExport, statisticInventory, statisticAccessUser, statisticImportExportAdmin, statisticInventoryAdmin } from '../controllers/statisticController';

const router = express.Router();

router.get('/statisticImportExport', statisticImportExport);
router.get('/statisticInventory', statisticInventory);
router.get('/statisticAccessUser', statisticAccessUser);
router.post('/statisticImportExportAdmin', statisticImportExportAdmin);
router.post('/statisticInventoryAdmin', statisticInventoryAdmin);

export default router;
