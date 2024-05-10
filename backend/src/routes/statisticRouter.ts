import express from 'express';
import { statisticImportExport, statisticInventory } from '../controllers/statisticController';

const router = express.Router();

router.get('/statisticImportExport', statisticImportExport);
router.get('/statisticInventory', statisticInventory);

export default router;
