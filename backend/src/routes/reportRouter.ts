import express from 'express';
import { insertReport, getUserReports, getPostReports, updateReport } from '../controllers/reportController';
import { protect } from '../middlewares/verifyMiddleware';

const reportRouter = express.Router();

reportRouter.post('/', protect, insertReport);

reportRouter.get('/userReports', protect, getUserReports);
reportRouter.get('/postReposts', protect, getPostReports);
reportRouter.put('/', protect, updateReport);

export default reportRouter;
