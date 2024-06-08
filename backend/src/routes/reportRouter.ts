import express from 'express';
import { insertReport, getUserReports, getPostReports, updateReport } from '../controllers/reportController';

const reportRouter = express.Router();

reportRouter.post('/', insertReport);

reportRouter.get('/userReports', getUserReports);
reportRouter.get('/postReposts', getPostReports);
reportRouter.put('/', updateReport);

export default reportRouter;
