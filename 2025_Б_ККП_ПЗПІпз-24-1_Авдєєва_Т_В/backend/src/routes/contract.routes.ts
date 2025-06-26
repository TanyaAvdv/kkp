import { Router } from 'express';
import { ContractController } from '../controllers/contract.controller';
const router = Router();
// Helper function to handle async route handlers
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
// Define route handlers with proper types
const getAllContracts = asyncHandler(ContractController.getAllContracts);
const getContractsByStatus = asyncHandler(ContractController.getContractsByStatus);
const getContractsByType = asyncHandler(ContractController.getContractsByType);
const getContractsByClientId = asyncHandler(ContractController.getContractsByClientId);
const getContractsByEstateId = asyncHandler(ContractController.getContractsByEstateId);
const getContractsByAgentId = asyncHandler(ContractController.getContractsByAgentId);
const getExpiringContracts = asyncHandler(ContractController.getExpiringSoonContracts);
const getContractById = asyncHandler(ContractController.getContractById);
const createContract = asyncHandler(ContractController.createContract);
const updateContract = asyncHandler(ContractController.updateContract);
const deleteContract = asyncHandler(ContractController.deleteContract);
// Apply route handlers with asyncHandler
router.get('/', getAllContracts);
router.get('/status/:status', getContractsByStatus);
router.get('/type/:type', getContractsByType);
router.get('/client/:clientId', getContractsByClientId);
router.get('/estate/:estateId', getContractsByEstateId);
router.get('/agent/:agentId', getContractsByAgentId);
router.get('/expiring', getExpiringContracts);
router.get('/:id', getContractById);
router.post('/', createContract);
router.put('/:id', updateContract);
router.delete('/:id', deleteContract);
export default router; 