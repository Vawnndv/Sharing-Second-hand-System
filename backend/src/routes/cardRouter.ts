import express from 'express';
import { createInputCard } from '../controllers/cardController';

const router = express.Router();

router.post('/createInputCard', createInputCard);

export default router;
