import express from 'express';
import { statisticImportExport, statisticInventory, statisticAccessUser } from '../controllers/statisticController';

const router = express.Router();

router.get('/statisticImportExport', statisticImportExport);
router.get('/statisticInventory', statisticInventory);
router.get('/statisticAccessUser', statisticAccessUser);

export default router;
