import express from 'express';
import { register, verification, login, forgotPassword, handleLoginWithGoogle, refreshAccessToken, removeFcmToken, removeRefreshToken } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);

router.post('/verification', verification);

router.post('/login', login);

router.post('/forgotPassword', forgotPassword);

router.post('/google-signin', handleLoginWithGoogle);

router.post('/refresh-token', refreshAccessToken);

router.post('/remove-fcmtoken', removeFcmToken);

router.post('/remove-refresh-token', removeRefreshToken);



export default router;
