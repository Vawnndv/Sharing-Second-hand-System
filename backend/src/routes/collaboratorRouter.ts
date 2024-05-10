import express from 'express';
import { adminBanCollaborator, adminDeleteCollaborator, getAllCollaborator, getTotalCollaborator } from '../controllers/collaboratorController';

const collaboratorRouter = express.Router();

collaboratorRouter.post('/collaborator-list/all', getAllCollaborator);


collaboratorRouter.post('/collaborator-list/total', getTotalCollaborator);

collaboratorRouter.delete('/collaborator-list/:id', adminDeleteCollaborator);

collaboratorRouter.put('/collaborator-list/banned/:id', adminBanCollaborator);

collaboratorRouter.post('/collaborator-list/all', getAllCollaborator);

collaboratorRouter.delete('/collaborator-list/:id', getAllCollaborator);

export default collaboratorRouter;
