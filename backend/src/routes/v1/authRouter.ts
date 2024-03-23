import express from 'express';
import { register, verification } from '../../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/verification', verification);

export default router;
