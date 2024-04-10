import express from 'express';
import { getPostOwnerInfo, getPostDetails, getPostReceivers, createPost, getAllPostFromUserPost, getAllPostFromWarehouse, searchPost, createPostReceiver } from '../controllers/postController';

const router = express.Router();

router.get('/user-post', getAllPostFromUserPost);
router.get('/warehouse', getAllPostFromWarehouse);

router.get('/postowner/:postID', getPostOwnerInfo);
router.get('/search', searchPost);
router.get('/:postID', getPostDetails);
router.get('/postreceivers/:postID', getPostReceivers);
router.post('/createPost', createPost);

router.post('/createPostReceiver', createPostReceiver);

// router.get('/posts/', getFilterPostList);


export default router;