import express from 'express';
import { protect } from '../middlewares/verifyMiddleware';
import { getRating, insertRating } from '../controllers/ratingController';

const ratingRouter = express.Router();

ratingRouter.post('/insertRating', protect, insertRating);

ratingRouter.get('/getRating', protect, getRating);

export default ratingRouter;
