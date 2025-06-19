import { Request as ExpressRequest, Response } from 'express';
import { RequestService } from '../services/request.service';
import { Request as RequestEntity } from '../types/entities';

export class RequestController {
  private static requestService = new RequestService();

  static async getAllRequests(req: ExpressRequest, res: Response) {
    try {
      const requests = await RequestController.requestService.findAll();
      res.json(requests);
    } catch (error) {
      console.error('Error in getAllRequests:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getRequestById(req: ExpressRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid request ID format' });
      }

      const request = await RequestController.requestService.findById(id);
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      res.json(request);
    } catch (error) {
      console.error('Error in getRequestById:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getRequestsByType(req: ExpressRequest, res: Response) {
    try {
      const { type } = req.params;
      if (!type) {
        return res.status(400).json({ error: 'Request type is required' });
      }

      const requests = await RequestController.requestService.findByType(type);
      res.json(requests);
    } catch (error) {
      console.error('Error in getRequestsByType:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getRequestsByClientId(req: ExpressRequest, res: Response) {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ error: 'Invalid client ID format' });
      }

      const requests = await RequestController.requestService.findByClientId(clientId);
      res.json(requests);
    } catch (error) {
      console.error('Error in getRequestsByClientId:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createRequest(req: ExpressRequest, res: Response) {
    try {
      const requestData: RequestEntity = req.body;

      // Validate required fields
      if (!requestData.request_name) {
        return res.status(400).json({ error: 'Request name is required' });
      }

      if (!requestData.request_type) {
        return res.status(400).json({ error: 'Request type is required' });
      }

      if (!requestData.request_date) {
        return res.status(400).json({ error: 'Request date is required' });
      }

      // Validate price
      if (requestData.price !== undefined && 
          (isNaN(Number(requestData.price)) || Number(requestData.price) < 0)) {
        return res.status(400).json({ error: 'Price must be a non-negative number' });
      }

      // Validate square
      if (requestData.square !== undefined && 
          (isNaN(Number(requestData.square)) || Number(requestData.square) <= 0)) {
        return res.status(400).json({ error: 'Square must be a positive number' });
      }

      // Validate rental_period_months
      if (requestData.rental_period_months !== undefined && 
          (isNaN(Number(requestData.rental_period_months)) || Number(requestData.rental_period_months) <= 0)) {
        return res.status(400).json({ error: 'Rental period must be a positive number' });
      }

      // Validate client_id if provided
      if (requestData.client_id !== undefined && 
          (isNaN(Number(requestData.client_id)) || Number(requestData.client_id) <= 0)) {
        return res.status(400).json({ error: 'Client ID must be a positive number' });
      }

      const requestId = await RequestController.requestService.create(requestData);
      res.status(201).json({ 
        message: 'Request created successfully', 
        request_id: requestId 
      });
    } catch (error) {
      console.error('Error in createRequest:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateRequest(req: ExpressRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid request ID format' });
      }

      const requestData: Partial<RequestEntity> = req.body;

      // Validate price if provided
      if (requestData.price !== undefined && 
          (isNaN(Number(requestData.price)) || Number(requestData.price) < 0)) {
        return res.status(400).json({ error: 'Price must be a non-negative number' });
      }

      // Validate square if provided
      if (requestData.square !== undefined && 
          (isNaN(Number(requestData.square)) || Number(requestData.square) <= 0)) {
        return res.status(400).json({ error: 'Square must be a positive number' });
      }

      // Validate rental_period_months if provided
      if (requestData.rental_period_months !== undefined && 
          (isNaN(Number(requestData.rental_period_months)) || Number(requestData.rental_period_months) <= 0)) {
        return res.status(400).json({ error: 'Rental period must be a positive number' });
      }

      // Validate client_id if provided
      if (requestData.client_id !== undefined && 
          requestData.client_id !== null && 
          (isNaN(Number(requestData.client_id)) || Number(requestData.client_id) <= 0)) {
        return res.status(400).json({ error: 'Client ID must be a positive number' });
      }

      const success = await RequestController.requestService.update(id, requestData);
      if (!success) {
        return res.status(404).json({ error: 'Request not found or no changes made' });
      }

      res.json({ message: 'Request updated successfully' });
    } catch (error) {
      console.error('Error in updateRequest:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteRequest(req: ExpressRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid request ID format' });
      }

      const success = await RequestController.requestService.delete(id);
      if (!success) {
        return res.status(404).json({ error: 'Request not found' });
      }

      res.json({ message: 'Request deleted successfully' });
    } catch (error) {
      console.error('Error in deleteRequest:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 