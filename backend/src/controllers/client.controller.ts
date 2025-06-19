import { Request, Response } from 'express';
import { ClientService } from '../services/client.service';
import { Client } from '../types/entities';

export class ClientController {
  private static clientService = new ClientService();

  static async getAllClients(req: Request, res: Response) {
    try {
      const clients = await ClientController.clientService.findAll();
      res.json(clients);
    } catch (error) {
      console.error('Error in getAllClients:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getClientById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid client ID format' });
      }

      const client = await ClientController.clientService.findById(id);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.json(client);
    } catch (error) {
      console.error('Error in getClientById:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getClientsByType(req: Request, res: Response) {
    try {
      const { type } = req.params;
      if (type !== 'tenant' && type !== 'renter') {
        return res.status(400).json({ error: 'Invalid client type. Must be "tenant" or "renter"' });
      }

      const clients = await ClientController.clientService.findByType(type);
      res.json(clients);
    } catch (error) {
      console.error('Error in getClientsByType:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createClient(req: Request, res: Response) {
    try {
      const clientData: Client = req.body;

      // Validate required fields
      if (!clientData.typeofClient) {
        return res.status(400).json({ error: 'Client type is required' });
      }

      // Validate client type
      if (clientData.typeofClient !== 'tenant' && clientData.typeofClient !== 'renter') {
        return res.status(400).json({ error: 'Invalid client type. Must be "tenant" or "renter"' });
      }

      // Validate contact_id if provided
      if (clientData.contact_id && (isNaN(clientData.contact_id) || clientData.contact_id <= 0)) {
        return res.status(400).json({ error: 'Invalid contact ID' });
      }

      const clientId = await ClientController.clientService.create(clientData);
      res.status(201).json({ 
        message: 'Client created successfully', 
        client_id: clientId 
      });
    } catch (error) {
      console.error('Error in createClient:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateClient(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid client ID format' });
      }

      const clientData: Partial<Client> = req.body;

      // Validate client type if provided
      if (clientData.typeofClient !== undefined &&
          clientData.typeofClient !== 'tenant' &&
          clientData.typeofClient !== 'renter') {
        return res.status(400).json({ error: 'Invalid client type. Must be "tenant" or "renter"' });
      }

      // Validate contact_id if provided
      if (clientData.contact_id !== undefined && 
          clientData.contact_id !== null && 
          (isNaN(clientData.contact_id) || clientData.contact_id <= 0)) {
        return res.status(400).json({ error: 'Invalid contact ID' });
      }

      const success = await ClientController.clientService.update(id, clientData);
      if (!success) {
        return res.status(404).json({ error: 'Client not found or no changes made' });
      }

      res.json({ message: 'Client updated successfully' });
    } catch (error) {
      console.error('Error in updateClient:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteClient(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid client ID format' });
      }

      const success = await ClientController.clientService.delete(id);
      if (!success) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.json({ message: 'Client deleted successfully' });
    } catch (error) {
      console.error('Error in deleteClient:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 