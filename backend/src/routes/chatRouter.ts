import express from 'express';
import { getUserChatList } from '../controllers/chatController';

const router = express.Router();

router.get('/list', getUserChatList);

export default router;
