import express from 'express';
import { adminBanCollaborator, adminCreateNewCollaborator, adminDeleteCollaborator, adminEditCollaborator, adminResetCollaboratorPassword, getAllCollaborator, getTotalCollaborator, getWarehouseInfoOfCollaborator } from '../controllers/collaboratorController';
import { protect, admin } from '../middlewares/verifyMiddleware';

const collaboratorRouter = express.Router();

collaboratorRouter.post('/collaborator-list/all', protect, admin, getAllCollaborator);

collaboratorRouter.post('/collaborator-list/total', protect, admin, getTotalCollaborator);

collaboratorRouter.delete('/collaborator-list/:id', protect, admin, adminDeleteCollaborator);

collaboratorRouter.put('/collaborator-list/banned/:id', protect, admin, adminBanCollaborator);

collaboratorRouter.post('/collaborator-list/create', protect, admin, adminCreateNewCollaborator);

collaboratorRouter.post('/collaborator-list/reset-password', protect, admin, adminResetCollaboratorPassword);

collaboratorRouter.post('/collaborator-list/all', protect, admin, getAllCollaborator);

collaboratorRouter.put('/collaborator-list/:id', protect, admin, adminEditCollaborator);

collaboratorRouter.delete('/collaborator-list/:id', protect, admin, getAllCollaborator);

collaboratorRouter.get('/getWarehouseAddress/:userid', protect, admin, getWarehouseInfoOfCollaborator);


export default collaboratorRouter;
