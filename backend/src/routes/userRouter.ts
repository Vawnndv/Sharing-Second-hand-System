import express from 'express';
import { changeUserPassword, getProfile, changeUserProfile, getUserLikePosts, setUserLikePosts, deleteUserLikePosts, getUserAddress, getAllUser, adminDeleteUser, adminBanUser, getTotalUser, updateFcmToken, removeFcmToken, getUserFcmTokens } from '../controllers/userController';
import { protect, admin } from '../middlewares/verifyMiddleware';

const userRouter = express.Router();

userRouter.get('/get-profile', protect, getProfile);

userRouter.put('/change-password', protect, changeUserPassword);

userRouter.post('/change-profile', protect, changeUserProfile);

userRouter.get('/get-like-posts', protect, getUserLikePosts);

userRouter.post('/update-like-post', protect, setUserLikePosts);

userRouter.delete('/delete-like-post', protect, deleteUserLikePosts);

userRouter.get('/get-user-address', protect, getUserAddress);

userRouter.post('/user-list/all', protect, admin, getAllUser);

userRouter.post('/user-list/total', protect, admin, getTotalUser);

userRouter.delete('/user-list/:id', protect, admin, adminDeleteUser);

userRouter.put('/user-list/banned/:id', protect, admin, adminBanUser);

userRouter.post('/add-fcmtoken', protect, updateFcmToken);

userRouter.post('/remove-fcmtoken', removeFcmToken);

userRouter.get('/get-fcmtokens', protect, getUserFcmTokens);



export default userRouter;
