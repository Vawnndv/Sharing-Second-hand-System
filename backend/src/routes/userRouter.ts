import express from 'express';
import { changeUserPassword, getProfile, changeUserProfile, getUserLikePosts, setUserLikePosts, deleteUserLikePosts, getUserAddress, getAllUser, adminDeleteUser, adminBanUser, getTotalUser, updateFcmToken, removeFcmToken, getUserFcmTokens } from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/get-profile', getProfile);

userRouter.put('/change-password', changeUserPassword);

userRouter.post('/change-profile', changeUserProfile);

userRouter.get('/get-like-posts', getUserLikePosts);

userRouter.post('/update-like-post', setUserLikePosts);

userRouter.delete('/delete-like-post', deleteUserLikePosts);

userRouter.get('/get-user-address', getUserAddress);

userRouter.post('/user-list/all', getAllUser);

userRouter.post('/user-list/total', getTotalUser);

userRouter.delete('/user-list/:id', adminDeleteUser);

userRouter.put('/user-list/banned/:id', adminBanUser);

userRouter.post('/add-fcmtoken', updateFcmToken);

userRouter.post('/remove-fcmtoken', removeFcmToken);

userRouter.get('/get-fcmtokens', getUserFcmTokens);



export default userRouter;
