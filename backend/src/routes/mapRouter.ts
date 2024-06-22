import express from 'express';
import { setUserLocation } from '../controllers/mapController';
import { protect } from '../middlewares/verifyMiddleware';

const router = express.Router();

router.post('/set_user_location', protect, setUserLocation);

export default router;
