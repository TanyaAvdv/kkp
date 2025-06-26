import { Request, Response } from 'express';
import { ContactService } from '../services/contact.service';
import { Contact } from '../types/entities';

export class ContactController {
  private static contactService = new ContactService();

  static async getAllContacts(req: Request, res: Response) {
    try {
      const contacts = await ContactController.contactService.findAll();
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getContactById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const contact = await ContactController.contactService.findById(id);
      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      res.json(contact);
    } catch (error) {
      console.error('Error fetching contact:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createContact(req: Request, res: Response) {
    try {
      const contactData: Contact = req.body;
      
      // Basic validation
      const requiredFields = ['name', 'surname', 'father_name', 'document', 'telephone', 
                            'email', 'country', 'city', 'postal_code', 'street', 'placement_num'];
      
      for (const field of requiredFields) {
        if (!contactData[field as keyof Contact]) {
          return res.status(400).json({ error: `Missing required field: ${field}` });
        }
      }

      const contactId = await ContactController.contactService.create(contactData);
      res.status(201).json({ id: contactId, message: 'Contact created successfully' });
    } catch (error) {
      console.error('Error creating contact:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateContact(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const contactData: Partial<Contact> = req.body;
      const success = await ContactController.contactService.update(id, contactData);

      if (!success) {
        return res.status(404).json({ error: 'Contact not found or no changes made' });
      }

      res.json({ message: 'Contact updated successfully' });
    } catch (error) {
      console.error('Error updating contact:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteContact(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const success = await ContactController.contactService.delete(id);
      if (!success) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 