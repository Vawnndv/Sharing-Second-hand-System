import express from 'express';
import { adminBanCollaborator, adminCreateNewCollaborator, adminDeleteCollaborator, adminEditCollaborator, adminResetCollaboratorPassword, getAllCollaborator, getTotalCollaborator, getWarehouseInfoOfCollaborator } from '../controllers/collaboratorController';

const collaboratorRouter = express.Router();

collaboratorRouter.post('/collaborator-list/all', getAllCollaborator);


collaboratorRouter.post('/collaborator-list/total', getTotalCollaborator);

collaboratorRouter.delete('/collaborator-list/:id', adminDeleteCollaborator);

collaboratorRouter.put('/collaborator-list/banned/:id', adminBanCollaborator);

collaboratorRouter.post('/collaborator-list/create', adminCreateNewCollaborator);

collaboratorRouter.post('/collaborator-list/reset-password', adminResetCollaboratorPassword);

collaboratorRouter.post('/collaborator-list/all', getAllCollaborator);

collaboratorRouter.put('/collaborator-list/:id', adminEditCollaborator);

collaboratorRouter.delete('/collaborator-list/:id', getAllCollaborator);

collaboratorRouter.get('/getWarehouseAddress/:userid', getWarehouseInfoOfCollaborator);


export default collaboratorRouter;
