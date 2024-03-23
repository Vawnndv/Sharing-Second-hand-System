import express from 'express';
import { register, verification, login } from '../../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/verification', verification);
router.post('/login', login);


export default router;
