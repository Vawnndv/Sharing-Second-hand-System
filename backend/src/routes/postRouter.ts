import express from 'express';
import { getPostOwnerInfo, getPostDetails, getPostReceivers, createPost, getAllPostFromUserPost, getAllPostFromWarehouse, searchPost, createPostReceiver, getUserLikePosts, deletePostReceivers, getAllPostByStatus } from '../controllers/postController';

const router = express.Router();

router.delete('/deletepostreceivers', deletePostReceivers);
router.post('/user-post', getAllPostFromUserPost);
router.post('/warehouse', getAllPostFromWarehouse);
router.get('/get-user-like-posts', getUserLikePosts);
router.get('/postowner/:postID', getPostOwnerInfo);
router.post('/search', searchPost);
router.get('/:postID', getPostDetails);
router.get('/postreceivers/:postID', getPostReceivers);
router.post('/createPost', createPost);

router.post('/createPostReceiver', createPostReceiver);
router.post('/get-posts-by-status', getAllPostByStatus);

// router.get('/posts/', getFilterPostList);


export default router;