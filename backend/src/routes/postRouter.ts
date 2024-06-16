import express from 'express';
import { getPostOwnerInfo, getPostDetails, getPostReceivers, createPost, getAllPostFromUserPost, getAllPostFromWarehouse, searchPost, createPostReceiver, getUserLikePosts, deletePostReceivers, getAllPostByStatus, updatePostStatus, getAllPostByUserId, EditPost, getAmountUserLikePost, getTotalPost } from '../controllers/postController';
import { protect } from '../middlewares/verifyMiddleware';

const router = express.Router();

router.post('/getAllPostByUserId', protect, getAllPostByUserId);
router.delete('/deletepostreceivers', protect, deletePostReceivers);
router.post('/user-post', protect, getAllPostFromUserPost);
router.post('/warehouse', protect, getAllPostFromWarehouse);
router.get('/get-user-like-posts', protect, getUserLikePosts);
router.get('/get-amount-user-like-post', protect, getAmountUserLikePost);
router.get('/postowner/:postID', protect, getPostOwnerInfo);
router.post('/search', protect, searchPost);
router.get('/:postID', protect, getPostDetails);
router.get('/postreceivers/:postID', protect, getPostReceivers);
router.post('/createPost', protect, createPost);

router.post('/createPostReceiver', protect, createPostReceiver);
router.post('/get-posts-by-status', protect, getAllPostByStatus);
router.post('/update-post-status', protect, updatePostStatus);
router.post('/editPost', protect, EditPost);
router.post('/getTotalPost', protect, getTotalPost);

// router.get('/posts/', getFilterPostList);


export default router;