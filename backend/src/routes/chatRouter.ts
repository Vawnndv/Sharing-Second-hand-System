import express from 'express';
import { getUserChatList, createNewChat, getUserChatListUser, getChatListCollaborator, getChatListUser, getChatWarehouse, createNewChatUser } from '../controllers/chatController';

const router = express.Router();

router.get('/list', getUserChatList);
router.post('/createNewChat', createNewChat);
router.get('/listUser', getUserChatListUser);

router.get('/getChatListCollaborator', getChatListCollaborator);
router.get('/getChatListUser', getChatListUser);
router.get('/getChatWarehouse', getChatWarehouse);
router.post('/createNewChatUser', createNewChatUser);

export default router;
