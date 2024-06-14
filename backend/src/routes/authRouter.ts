import express from 'express';
import { register, verification, login, forgotPassword, handleLoginWithGoogle } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);

router.post('/verification', verification);

router.post('/login', login);

router.post('/forgotPassword', forgotPassword);

router.post('/google-signin', handleLoginWithGoogle);

export default router;
