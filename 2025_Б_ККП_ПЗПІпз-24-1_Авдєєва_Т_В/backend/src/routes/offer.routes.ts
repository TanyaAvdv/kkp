import express from 'express';
import { OfferController } from '../controllers/offer.controller';

const router = express.Router();

// Helper function to handle async route handlers
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Get all offers
router.get('/', asyncHandler(OfferController.getAllOffers));

// Get offers by type
router.get('/type/:type', asyncHandler(OfferController.getOffersByType));

// Get offers by client ID
router.get('/client/:clientId', asyncHandler(OfferController.getOffersByClientId));

// Get offers by agent ID
router.get('/agent/:agentId', asyncHandler(OfferController.getOffersByAgentId));

// Get offer by ID
router.get('/:id', asyncHandler(OfferController.getOfferById));

// Create new offer
router.post('/', asyncHandler(OfferController.createOffer));

// Update offer
router.put('/:id', asyncHandler(OfferController.updateOffer));

// Delete offer
router.delete('/:id', asyncHandler(OfferController.deleteOffer));

export default router; 