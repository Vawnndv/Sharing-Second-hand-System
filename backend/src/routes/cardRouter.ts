import express from 'express';
import { createInputCard, createOutputCard } from '../controllers/cardController';
import { protect } from '../middlewares/verifyMiddleware';

const router = express.Router();

router.post('/createInputCard', protect, createInputCard);
router.post('/createOutputCard', protect, createOutputCard);

export default router;
