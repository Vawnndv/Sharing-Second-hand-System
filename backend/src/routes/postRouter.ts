import express from 'express';
import {  getPostDetails, getPostReceivers, createPost, searchPost } from '../controllers/postController';

const router = express.Router();


router.get('/posts/search', searchPost);
router.get('/posts/:postID', getPostDetails);
router.get('/posts/postreceivers/:postID', getPostReceivers);
router.post('/posts/createPost', createPost);


export default router;