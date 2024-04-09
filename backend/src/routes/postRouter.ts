import express from 'express';
import { getPostDetails, getPostReceivers, createPost, getAllPostFromUserPost, getAllPostFromWarehouse, searchPost, createPostReceiver } from '../controllers/postController';

const router = express.Router();

router.get('/posts/user-post/all', getAllPostFromUserPost);
router.get('/posts/warehouse/all', getAllPostFromWarehouse);

router.get('/posts/search', searchPost);
router.get('/posts/:postID', getPostDetails);
router.get('/posts/postreceivers/:postID', getPostReceivers);
router.post('/posts/createPost', createPost);

router.post('/posts/createPostReceiver', createPostReceiver);

// router.get('/posts/', getFilterPostList);


export default router;