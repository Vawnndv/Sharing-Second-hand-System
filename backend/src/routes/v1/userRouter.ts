import express from 'express';
import { changeUserPassword } from './../../controllers/userController';

const userRouter = express.Router();

// userRouter.get('/profile/:email', getProfile);

userRouter.post('/password', changeUserPassword);

export default userRouter;
