import express from 'express';
import { insertReport } from '../controllers/reportController';

const reportRouter = express.Router();

reportRouter.post('/', insertReport);

export default reportRouter;
