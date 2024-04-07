import express from 'express';
import { changeUserPassword, getProfile, changeUserProfile } from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/get-profile', getProfile);

userRouter.post('/change-password', changeUserPassword);

userRouter.post('/change-profile', changeUserProfile);


export default userRouter;
