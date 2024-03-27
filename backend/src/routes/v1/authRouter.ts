import express from 'express';
import { register, verification, login, forgotPassword } from '../../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/verification', verification);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);

export default router;
