import { Request, Response } from 'express';
import { AgentService } from '../services/agent.service';
import { Agent } from '../types/entities';

export class AgentController {
  private static agentService = new AgentService();

  static async getAllAgents(req: Request, res: Response) {
    try {
      const agents = await AgentController.agentService.findAll();
      res.json(agents);
    } catch (error) {
      console.error('Error in getAllAgents:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAgentById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid agent ID' });
      }

      const agent = await AgentController.agentService.findById(id);
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      res.json(agent);
    } catch (error) {
      console.error('Error in getAgentById:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAgentsByDepartment(req: Request, res: Response) {
    try {
      const { department } = req.params;
      if (!department) {
        return res.status(400).json({ error: 'Department parameter is required' });
      }

      const agents = await AgentController.agentService.findByDepartment(department);
      res.json(agents);
    } catch (error) {
      console.error('Error in getAgentsByDepartment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createAgent(req: Request, res: Response) {
    try {
      const agentData: Omit<Agent, 'agent_id'> = req.body;

      // Validate required fields
      if (!agentData.agent_rating) {
        return res.status(400).json({ error: 'Agent rating is required' });
      }

      if (!agentData.post_name) {
        return res.status(400).json({ error: 'Post name is required' });
      }

      if (!agentData.salary) {
        return res.status(400).json({ error: 'Salary is required' });
      }

      if (!agentData.currency) {
        return res.status(400).json({ error: 'Currency is required' });
      }

      if (!agentData.hiring_date) {
        return res.status(400).json({ error: 'Hiring date is required' });
      }

      if (!agentData.department_name) {
        return res.status(400).json({ error: 'Department name is required' });
      }

      const agentId = await AgentController.agentService.create(agentData);
      res.status(201).json({ 
        message: 'Agent created successfully', 
        agent_id: agentId 
      });
    } catch (error) {
      console.error('Error in createAgent:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateAgent(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid agent ID' });
      }

      const agentData: Partial<Agent> = req.body;

      const success = await AgentController.agentService.update(id, agentData);
      if (!success) {
        return res.status(404).json({ error: 'Agent not found or no changes made' });
      }

      res.json({ message: 'Agent updated successfully' });
    } catch (error) {
      console.error('Error in updateAgent:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteAgent(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid agent ID' });
      }

      const success = await AgentController.agentService.delete(id);
      if (!success) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      res.json({ message: 'Agent deleted successfully' });
    } catch (error) {
      console.error('Error in deleteAgent:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 