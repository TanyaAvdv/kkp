import { Router, RequestHandler } from 'express';
import { ClientController } from '../controllers/client.controller';

const router = Router();

// Get all clients
router.get('/', ClientController.getAllClients as RequestHandler);

// Get clients by type
router.get('/type/:type', ClientController.getClientsByType as RequestHandler);

// Get client by ID
router.get('/:id', ClientController.getClientById as RequestHandler);

// Create new client
router.post('/', ClientController.createClient as RequestHandler);

// Update client
router.put('/:id', ClientController.updateClient as RequestHandler);

// Delete client
router.delete('/:id', ClientController.deleteClient as RequestHandler);

export default router; 