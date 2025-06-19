import { Router } from 'express';
import { RequestController } from '../controllers/request.controller';

const router = Router();

// Helper function to handle async route handlers
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Get all requests
router.get('/', asyncHandler(RequestController.getAllRequests));

// Get requests by type
router.get('/type/:type', asyncHandler(RequestController.getRequestsByType));

// Get requests by client ID
router.get('/client/:clientId', asyncHandler(RequestController.getRequestsByClientId));

// Get request by ID
router.get('/:id', asyncHandler(RequestController.getRequestById));

// Create new request
router.post('/', asyncHandler(RequestController.createRequest));

// Update request
router.put('/:id', asyncHandler(RequestController.updateRequest));

// Delete request
router.delete('/:id', asyncHandler(RequestController.deleteRequest));

export default router; 