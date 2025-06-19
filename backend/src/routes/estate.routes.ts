import { Router, RequestHandler } from 'express';
import { EstateController } from '../controllers/estate.controller';

const router = Router();

// Get all estates
router.get('/', EstateController.getAllEstates as RequestHandler);

// Get estates by type
router.get('/type/:type', EstateController.getEstatesByType as RequestHandler);

// Get estates by status
router.get('/status/:status', EstateController.getEstatesByStatus as RequestHandler);

// Get estates by price range
router.get('/price-range', EstateController.getEstatesByPriceRange as RequestHandler);

// Get estate by ID
router.get('/:id', EstateController.getEstateById as RequestHandler);

// Create new estate
router.post('/', EstateController.createEstate as RequestHandler);

// Update estate
router.put('/:id', EstateController.updateEstate as RequestHandler);

// Delete estate
router.delete('/:id', EstateController.deleteEstate as RequestHandler);

export default router; 