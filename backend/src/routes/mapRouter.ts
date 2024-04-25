import express from 'express';
import { setUserLocation } from '../controllers/mapController';

const router = express.Router();

router.post('/set_user_location', setUserLocation);

export default router;
