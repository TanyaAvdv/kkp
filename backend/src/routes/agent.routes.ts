import { Router } from 'express';
import { AgentController } from '../controllers/agent.controller';

const router = Router();

// Helper function to handle async route handlers
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Get all agents
router.get('/', asyncHandler(AgentController.getAllAgents));

// Get agents by department
router.get('/department/:department', asyncHandler(AgentController.getAgentsByDepartment));

// Get agent by ID
router.get('/:id', asyncHandler(AgentController.getAgentById));

// Create new agent
router.post('/', asyncHandler(AgentController.createAgent));

// Update agent
router.put('/:id', asyncHandler(AgentController.updateAgent));

// Delete agent
router.delete('/:id', asyncHandler(AgentController.deleteAgent));

export default router; 