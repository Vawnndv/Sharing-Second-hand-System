import express from 'express';
import { getUserChatList, createNewChat } from '../controllers/chatController';

const router = express.Router();

router.get('/list', getUserChatList);
router.post('/createNewChat', createNewChat);

export default router;
