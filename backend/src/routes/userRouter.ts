import express from 'express';
import { changeUserPassword, getProfile, changeUserProfile, setUserLikePosts, deleteUserLikePosts, getUserAddress, getAllUser, adminDeleteUser, adminBanUser, getTotalUser, updateFcmToken, getUserFcmTokens, getUserLikePosts, getUserReceivePosts, getUserOfTotalGiveAndReceiveOrder } from '../controllers/userController';
import { protect, admin } from '../middlewares/verifyMiddleware';

const userRouter = express.Router();

userRouter.get('/get-profile', protect, getProfile);

userRouter.put('/change-password', protect, changeUserPassword);

userRouter.post('/change-profile', protect, changeUserProfile);

userRouter.get('/get-like-posts', protect, getUserLikePosts);

userRouter.get('/get-receive-posts', protect, getUserReceivePosts);

userRouter.post('/update-like-post', protect, setUserLikePosts);

userRouter.delete('/delete-like-post', protect, deleteUserLikePosts);

userRouter.get('/get-user-address', protect, getUserAddress);

userRouter.post('/user-list/all', protect, admin, getAllUser);

userRouter.post('/user-list/total', protect, admin, getTotalUser);

userRouter.delete('/user-list/:id', protect, admin, adminDeleteUser);

userRouter.get('/get-count-order', protect, getUserOfTotalGiveAndReceiveOrder);

userRouter.put('/user-list/banned/:id', protect, admin, adminBanUser);

userRouter.post('/add-fcmtoken', protect, updateFcmToken);


userRouter.get('/get-fcmtokens', protect, getUserFcmTokens);



export default userRouter;
