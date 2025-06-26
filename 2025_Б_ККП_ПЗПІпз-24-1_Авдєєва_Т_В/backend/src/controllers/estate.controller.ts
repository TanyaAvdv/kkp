import { Request, Response } from 'express';
import { EstateService } from '../services/estate.service';
import { Estate } from '../types/entities';

export class EstateController {
  private static estateService = new EstateService();

  static async getAllEstates(req: Request, res: Response) {
    try {
      const estates = await EstateController.estateService.findAll();
      res.json(estates);
    } catch (error) {
      console.error('Error fetching estates:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getEstateById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const estate = await EstateController.estateService.findById(id);
      if (!estate) {
        return res.status(404).json({ error: 'Estate not found' });
      }

      res.json(estate);
    } catch (error) {
      console.error('Error fetching estate:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getEstatesByType(req: Request, res: Response) {
    try {
      const type = req.params.type;
      if (!type) {
        return res.status(400).json({ error: 'Estate type is required' });
      }

      const estates = await EstateController.estateService.findByType(type);
      res.json(estates);
    } catch (error) {
      console.error('Error fetching estates by type:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getEstatesByStatus(req: Request, res: Response) {
    try {
      const status = req.params.status;
      if (!status) {
        return res.status(400).json({ error: 'Estate status is required' });
      }

      const estates = await EstateController.estateService.findByStatus(status);
      res.json(estates);
    } catch (error) {
      console.error('Error fetching estates by status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getEstatesByPriceRange(req: Request, res: Response) {
    try {
      const { minPrice, maxPrice } = req.query;
      
      if (!minPrice || !maxPrice) {
        return res.status(400).json({ 
          error: 'Both minPrice and maxPrice are required' 
        });
      }

      const min = parseFloat(minPrice as string);
      const max = parseFloat(maxPrice as string);

      if (isNaN(min) || isNaN(max)) {
        return res.status(400).json({ 
          error: 'Invalid price range format' 
        });
      }

      if (min > max) {
        return res.status(400).json({ 
          error: 'minPrice cannot be greater than maxPrice' 
        });
      }

      const estates = await EstateController.estateService.findByPriceRange(min, max);
      res.json(estates);
    } catch (error) {
      console.error('Error fetching estates by price range:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createEstate(req: Request, res: Response) {
    try {
      const estateData: Estate = req.body;
      
      // Basic validation
      const requiredFields = [
        'estate_name', 'estate_status', 'estate_type', 
        'square', 'price', 'country', 'city', 
        'postal_code', 'street', 'placement_num', 
        'estate_rating'
      ];
      
      for (const field of requiredFields) {
        if (!estateData[field as keyof Estate]) {
          return res.status(400).json({ 
            error: `Missing required field: ${field}` 
          });
        }
      }

      // Validate numeric fields
      if (isNaN(Number(estateData.square)) || Number(estateData.square) <= 0) {
        return res.status(400).json({ 
          error: 'Square must be a positive number' 
        });
      }

      if (isNaN(Number(estateData.price)) || Number(estateData.price) < 0) {
        return res.status(400).json({ 
          error: 'Price must be a non-negative number' 
        });
      }

      // Validate currency if provided
      if (estateData.currency && estateData.currency.length !== 3) {
        return res.status(400).json({ 
          error: 'Currency must be a 3-letter code' 
        });
      }

      const estateId = await EstateController.estateService.create(estateData);
      res.status(201).json({ 
        id: estateId, 
        message: 'Estate created successfully' 
      });
    } catch (error) {
      console.error('Error creating estate:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateEstate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const estateData: Partial<Estate> = req.body;

      // Validate numeric fields if provided
      if (estateData.square !== undefined && 
          (isNaN(Number(estateData.square)) || Number(estateData.square) <= 0)) {
        return res.status(400).json({ 
          error: 'Square must be a positive number' 
        });
      }

      if (estateData.price !== undefined && 
          (isNaN(Number(estateData.price)) || Number(estateData.price) < 0)) {
        return res.status(400).json({ 
          error: 'Price must be a non-negative number' 
        });
      }

      // Validate currency if provided
      if (estateData.currency && estateData.currency.length !== 3) {
        return res.status(400).json({ 
          error: 'Currency must be a 3-letter code' 
        });
      }

      const success = await EstateController.estateService.update(id, estateData);
      if (!success) {
        return res.status(404).json({ 
          error: 'Estate not found or no changes made' 
        });
      }

      res.json({ message: 'Estate updated successfully' });
    } catch (error) {
      console.error('Error updating estate:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteEstate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const success = await EstateController.estateService.delete(id);
      if (!success) {
        return res.status(404).json({ error: 'Estate not found' });
      }

      res.json({ message: 'Estate deleted successfully' });
    } catch (error) {
      console.error('Error deleting estate:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 