import express from 'express';
import { createInputCard, createOutputCard } from '../controllers/cardController';

const router = express.Router();

router.post('/createInputCard', createInputCard);
router.post('/createOutputCard', createOutputCard);

export default router;
