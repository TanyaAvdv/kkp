import { Router } from 'express';
import { RequestController } from '../controllers/request.controller';

const router = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', asyncHandler(RequestController.getAllRequests));

router.get('/type/:type', asyncHandler(RequestController.getRequestsByType));

router.get('/client/:clientId', asyncHandler(RequestController.getRequestsByClientId));

router.get('/:id', asyncHandler(RequestController.getRequestById));

router.post('/', asyncHandler(RequestController.createRequest));

router.put('/:id', asyncHandler(RequestController.updateRequest));

router.delete('/:id', asyncHandler(RequestController.deleteRequest));

export default router; 