import { Request, Response } from 'express';
import { ContractService } from '../services/contract.service';
import { Contract } from '../types/entities';

export class ContractController {
  private static contractService = new ContractService();

  static async getAllContracts(req: Request, res: Response) {
    try {
      const contracts = await ContractController.contractService.findAll();
      res.json(contracts);
    } catch (error) {
      console.error('Error in getAllContracts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getContractById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid contract ID format' });
      }

      const contract = await ContractController.contractService.findById(id);
      if (!contract) {
        return res.status(404).json({ error: 'Contract not found' });
      }

      res.json(contract);
    } catch (error) {
      console.error('Error in getContractById:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getContractsByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      if (!status) {
        return res.status(400).json({ error: 'Status parameter is required' });
      }

      const contracts = await ContractController.contractService.findByStatus(status);
      res.json(contracts);
    } catch (error) {
      console.error('Error in getContractsByStatus:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getContractsByType(req: Request, res: Response) {
    try {
      const { type } = req.params;
      if (!type) {
        return res.status(400).json({ error: 'Type parameter is required' });
      }

      const contracts = await ContractController.contractService.findByType(type);
      res.json(contracts);
    } catch (error) {
      console.error('Error in getContractsByType:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getContractsByClientId(req: Request, res: Response) {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ error: 'Invalid client ID format' });
      }

      const contracts = await ContractController.contractService.findByClientId(clientId);
      res.json(contracts);
    } catch (error) {
      console.error('Error in getContractsByClientId:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getContractsByEstateId(req: Request, res: Response) {
    try {
      const estateId = parseInt(req.params.estateId);
      if (isNaN(estateId)) {
        return res.status(400).json({ error: 'Invalid estate ID format' });
      }

      const contracts = await ContractController.contractService.findByEstateId(estateId);
      res.json(contracts);
    } catch (error) {
      console.error('Error in getContractsByEstateId:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getContractsByAgentId(req: Request, res: Response) {
    try {
      const agentId = parseInt(req.params.agentId);
      if (isNaN(agentId)) {
        return res.status(400).json({ error: 'Invalid agent ID format' });
      }

      const contracts = await ContractController.contractService.findByAgentId(agentId);
      res.json(contracts);
    } catch (error) {
      console.error('Error in getContractsByAgentId:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getActiveContracts(req: Request, res: Response) {
    try {
      const contracts = await ContractController.contractService.findActive();
      res.json(contracts);
    } catch (error) {
      console.error('Error in getActiveContracts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getExpiringSoonContracts(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const contracts = await ContractController.contractService.findExpiringSoon(days);
      res.json(contracts);
    } catch (error) {
      console.error('Error in getExpiringSoonContracts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createContract(req: Request, res: Response) {
    try {
      const contractData: Contract = req.body;

      // Validate required fields
      if (!contractData.contract_name) {
        return res.status(400).json({ error: 'Contract name is required' });
      }

      if (!contractData.contract_status) {
        return res.status(400).json({ error: 'Contract status is required' });
      }

      if (!contractData.signing_date) {
        return res.status(400).json({ error: 'Signing date is required' });
      }

      if (!contractData.validity_period) {
        return res.status(400).json({ error: 'Validity period is required' });
      }

      // Validate dates
      const signingDate = new Date(contractData.signing_date);
      if (isNaN(signingDate.getTime())) {
        return res.status(400).json({ error: 'Invalid signing date format' });
      }

      const validityDate = new Date(contractData.validity_period);
      if (isNaN(validityDate.getTime())) {
        return res.status(400).json({ error: 'Invalid validity period format' });
      }

      if (validityDate <= signingDate) {
        return res.status(400).json({ error: 'Validity period must be after signing date' });
      }

      const contractId = await ContractController.contractService.create(contractData);
      res.status(201).json({ 
        message: 'Contract created successfully', 
        contract_id: contractId 
      });
    } catch (error) {
      console.error('Error in createContract:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateContract(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid contract ID format' });
      }

      const contractData: Partial<Contract> = req.body;

      // Validate dates if provided
      if (contractData.signing_date) {
        const signingDate = new Date(contractData.signing_date);
        if (isNaN(signingDate.getTime())) {
          return res.status(400).json({ error: 'Invalid signing date format' });
        }
      }

      if (contractData.validity_period) {
        const validityDate = new Date(contractData.validity_period);
        if (isNaN(validityDate.getTime())) {
          return res.status(400).json({ error: 'Invalid validity period format' });
        }
      }

      // Validate that validity period is after signing date if both are provided
      if (contractData.signing_date && contractData.validity_period) {
        const signingDate = new Date(contractData.signing_date);
        const validityDate = new Date(contractData.validity_period);
        if (validityDate <= signingDate) {
          return res.status(400).json({ error: 'Validity period must be after signing date' });
        }
      }

      const success = await ContractController.contractService.update(id, contractData);
      if (!success) {
        return res.status(404).json({ error: 'Contract not found or no changes made' });
      }

      res.json({ message: 'Contract updated successfully' });
    } catch (error) {
      console.error('Error in updateContract:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteContract(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid contract ID format' });
      }

      const success = await ContractController.contractService.delete(id);
      if (!success) {
        return res.status(404).json({ error: 'Contract not found' });
      }

      res.json({ message: 'Contract deleted successfully' });
    } catch (error) {
      console.error('Error in deleteContract:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 