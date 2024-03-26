import express from 'express';
import {  getPostDetails } from '../../controllers/postController';

const router = express.Router();


router.get('/posts/:postID', getPostDetails);


export default router;