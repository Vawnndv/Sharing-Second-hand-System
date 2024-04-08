import express from 'express';
import { changeUserPassword, getProfile, changeUserProfile, getUserLikePosts, setUserLikePosts, deleteUserLikePosts } from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/get-profile', getProfile);

userRouter.post('/change-password', changeUserPassword);

userRouter.post('/change-profile', changeUserProfile);

userRouter.get('/get-like-posts', getUserLikePosts);

userRouter.post('/update-like-post', setUserLikePosts);

userRouter.delete('/delete-like-post', deleteUserLikePosts);


export default userRouter;
