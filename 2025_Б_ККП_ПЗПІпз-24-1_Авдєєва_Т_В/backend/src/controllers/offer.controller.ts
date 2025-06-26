import { Request, Response } from 'express';
import { OfferService } from '../services/offer.service';
import { Offer } from '../types/entities';

export class OfferController {
  private static offerService = new OfferService();

  static async getAllOffers(req: Request, res: Response) {
    try {
      const offers = await OfferController.offerService.findAll();
      res.json(offers);
    } catch (error) {
      console.error('Error in getAllOffers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getOfferById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid offer ID format' });
      }

      const offer = await OfferController.offerService.findById(id);
      if (!offer) {
        return res.status(404).json({ error: 'Offer not found' });
      }

      res.json(offer);
    } catch (error) {
      console.error('Error in getOfferById:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getOffersByType(req: Request, res: Response) {
    try {
      const { type } = req.params;
      if (!type) {
        return res.status(400).json({ error: 'Type parameter is required' });
      }

      const offers = await OfferController.offerService.findByType(type);
      res.json(offers);
    } catch (error) {
      console.error('Error in getOffersByType:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getOffersByClientId(req: Request, res: Response) {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ error: 'Invalid client ID format' });
      }

      const offers = await OfferController.offerService.findByClientId(clientId);
      res.json(offers);
    } catch (error) {
      console.error('Error in getOffersByClientId:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getOffersByAgentId(req: Request, res: Response) {
    try {
      const agentId = parseInt(req.params.agentId);
      if (isNaN(agentId)) {
        return res.status(400).json({ error: 'Invalid agent ID format' });
      }

      const offers = await OfferController.offerService.findByAgentId(agentId);
      res.json(offers);
    } catch (error) {
      console.error('Error in getOffersByAgentId:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createOffer(req: Request, res: Response) {
    try {
      const offerData: Omit<Offer, 'offer_id'> = req.body;

      // Validate required fields
      if (!offerData.offer_name) {
        return res.status(400).json({ error: 'Offer name is required' });
      }

      if (!offerData.offer_type) {
        return res.status(400).json({ error: 'Offer type is required' });
      }

      if (!offerData.offer_date) {
        return res.status(400).json({ error: 'Offer date is required' });
      }

      // Validate date
      const offerDate = new Date(offerData.offer_date);
      if (isNaN(offerDate.getTime())) {
        return res.status(400).json({ error: 'Invalid offer date format' });
      }

      const offerId = await OfferController.offerService.create(offerData);
      res.status(201).json({ 
        message: 'Offer created successfully', 
        offer_id: offerId 
      });
    } catch (error) {
      console.error('Error in createOffer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateOffer(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid offer ID format' });
      }

      const offerData: Partial<Offer> = req.body;

      // Validate date if provided
      if (offerData.offer_date) {
        const offerDate = new Date(offerData.offer_date);
        if (isNaN(offerDate.getTime())) {
          return res.status(400).json({ error: 'Invalid offer date format' });
        }
      }

      const success = await OfferController.offerService.update(id, offerData);
      if (!success) {
        return res.status(404).json({ error: 'Offer not found or no changes made' });
      }

      res.json({ message: 'Offer updated successfully' });
    } catch (error) {
      console.error('Error in updateOffer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteOffer(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid offer ID format' });
      }

      const success = await OfferController.offerService.delete(id);
      if (!success) {
        return res.status(404).json({ error: 'Offer not found' });
      }

      res.json({ message: 'Offer deleted successfully' });
    } catch (error) {
      console.error('Error in deleteOffer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 