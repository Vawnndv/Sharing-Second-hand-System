import express from 'express';
import { changeUserPassword, getProfile } from './../../controllers/userController';

const userRouter = express.Router();

userRouter.get('/profile', getProfile);

userRouter.post('/password', changeUserPassword);

export default userRouter;
