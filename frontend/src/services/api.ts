import axios from 'axios';
import type { 
  Contact, Client, Estate, Contract, Request, Offer, Agent
} from '../types/entities';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Contact API
export const contactApi = {
  getAll: () => api.get<Contact[]>('/contacts'),
  getById: (id: number) => api.get<Contact>(`/contacts/${id}`),
  create: (contact: Omit<Contact, 'contact_id'>) => api.post<{ contact_id: number }>('/contacts', contact),
  update: (id: number, contact: Partial<Contact>) => api.put(`/contacts/${id}`, contact),
  delete: (id: number) => api.delete(`/contacts/${id}`),
};

// Client API
export const clientApi = {
  getAll: () => api.get<Client[]>('/clients'),
  getById: (id: number) => api.get<Client>(`/clients/${id}`),
  getByType: (type: 'tenant' | 'renter') => api.get<Client[]>(`/clients/type/${type}`),
  create: (client: Omit<Client, 'client_id'>) => api.post<{ client_id: number }>('/clients', client),
  update: (id: number, client: Partial<Client>) => api.put(`/clients/${id}`, client),
  delete: (id: number) => api.delete(`/clients/${id}`),
};

// Agent API
export const agentApi = {
  getAll: () => api.get<Agent[]>('/agents'),
  getById: (id: number) => api.get<Agent>(`/agents/${id}`),
  getByDepartment: (department: string) => api.get<Agent[]>(`/agents/department/${department}`),
  create: (agent: Omit<Agent, 'agent_id'>) => api.post<{ agent_id: number }>('/agents', agent),
  update: (id: number, agent: Partial<Agent>) => api.put(`/agents/${id}`, agent),
  delete: (id: number) => api.delete(`/agents/${id}`),
};



// Estate API
export const estateApi = {
  getAll: () => api.get<Estate[]>('/estates'),
  getById: (id: number) => api.get<Estate>(`/estates/${id}`),
  getByType: (type: string) => api.get<Estate[]>(`/estates/type/${type}`),
  getByStatus: (status: string) => api.get<Estate[]>(`/estates/status/${status}`),
  getByPriceRange: (minPrice: number, maxPrice: number) => api.get<Estate[]>(`/estates/price/${minPrice}/${maxPrice}`),
  create: (estate: Omit<Estate, 'estate_id'>) => api.post<{ estate_id: number }>('/estates', estate),
  update: (id: number, estate: Partial<Estate>) => api.put(`/estates/${id}`, estate),
  delete: (id: number) => api.delete(`/estates/${id}`),
};

// Contract API
export const contractApi = {
  getAll: () => api.get<Contract[]>('/contracts'),
  getById: (id: number) => api.get<Contract>(`/contracts/${id}`),
  getByStatus: (status: string) => api.get<Contract[]>(`/contracts/status/${status}`),
  getByType: (type: string) => api.get<Contract[]>(`/contracts/type/${type}`),
  getByClientId: (clientId: number) => api.get<Contract[]>(`/contracts/client/${clientId}`),
  getByEstateId: (estateId: number) => api.get<Contract[]>(`/contracts/estate/${estateId}`),
  getByAgentId: (agentId: number) => api.get<Contract[]>(`/contracts/agent/${agentId}`),
  getActive: () => api.get<Contract[]>('/contracts/active'),
  getExpiringSoon: (days?: number) => api.get<Contract[]>(`/contracts/expiring${days ? `?days=${days}` : ''}`),
  create: (contract: Omit<Contract, 'contract_id'>) => api.post<{ contract_id: number }>('/contracts', contract),
  update: (id: number, contract: Partial<Contract>) => api.put(`/contracts/${id}`, contract),
  delete: (id: number) => api.delete(`/contracts/${id}`),
};

// Request API
export const requestApi = {
  getAll: () => api.get<Request[]>('/requests'),
  getById: (id: number) => api.get<Request>(`/requests/${id}`),
  getByType: (type: string) => api.get<Request[]>(`/requests/type/${type}`),
  getByClientId: (clientId: number) => api.get<Request[]>(`/requests/client/${clientId}`),
  create: (request: Omit<Request, 'request_id'>) => api.post<{ request_id: number }>('/requests', request),
  update: (id: number, request: Partial<Request>) => api.put(`/requests/${id}`, request),
  delete: (id: number) => api.delete(`/requests/${id}`),
};

// Offer API
export const offerApi = {
  getAll: () => api.get<Offer[]>('/offers'),
  getById: (id: number) => api.get<Offer>(`/offers/${id}`),
  getByType: (type: string) => api.get<Offer[]>(`/offers/type/${type}`),
  getByClientId: (clientId: number) => api.get<Offer[]>(`/offers/client/${clientId}`),
  getByAgentId: (agentId: number) => api.get<Offer[]>(`/offers/agent/${agentId}`),
  create: (offer: Omit<Offer, 'offer_id'>) => api.post<{ offer_id: number }>('/offers', offer),
  update: (id: number, offer: Partial<Offer>) => api.put(`/offers/${id}`, offer),
  delete: (id: number) => api.delete(`/offers/${id}`),
};

// Dashboard API
export const dashboardApi = {
  getOverallStats: () => api.get('/dashboard/stats/overall'),
  getClientStats: () => api.get('/dashboard/stats/clients'),
  getEstateStats: () => api.get('/dashboard/stats/estates'),
  getContractStats: () => api.get('/dashboard/stats/contracts'),
  getRequestStats: () => api.get('/dashboard/stats/requests'),
  getOfferStats: () => api.get('/dashboard/stats/offers'),

  getRecentActivities: () => api.get('/dashboard/stats/recent-activities'),
};

export default api; 