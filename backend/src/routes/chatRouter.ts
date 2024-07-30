import express from 'express';
import { getUserChatList, createNewChat, getUserChatListUser, getChatListCollaborator, getChatListUser, getChatWarehouse, createNewChatUser, getWareHouseByUserID, getAllChatListCollaborator } from '../controllers/chatController';
import { protect } from '../middlewares/verifyMiddleware';

const router = express.Router();

router.get('/list', protect, getUserChatList);
router.post('/createNewChat', protect, createNewChat);
router.get('/listUser', protect, getUserChatListUser);

router.get('/getChatListCollaborator', protect, getChatListCollaborator);
router.get('/getAllChatListCollaborator', protect, getAllChatListCollaborator);
router.get('/getChatListUser', protect, getChatListUser);
router.get('/getChatWarehouse', protect, getChatWarehouse);
router.post('/createNewChatUser', protect, createNewChatUser);
router.get('/getWareHouseByUserID', protect, getWareHouseByUserID);

export default router;
