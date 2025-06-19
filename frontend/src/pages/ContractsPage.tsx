import React, { useState, useEffect } from 'react';
import { contractApi, estateApi, clientApi } from '../services/api';
import type { Contract, Estate, Client } from '../types/entities';

const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [estates, setEstates] = useState<Estate[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [formData, setFormData] = useState({
    contract_name: '',
    contract_status: '',
    signing_date: new Date().toISOString().split('T')[0],
    validity_period: new Date().toISOString().split('T')[0],
    notes: '',
    estate_id: 0,
    agent_id: 0,
    tenant_id: 0,
    renter_id: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [contractsResponse, estatesResponse, clientsResponse] = await Promise.all([
        contractApi.getAll(),
        estateApi.getAll(),
        clientApi.getAll()
      ]);
      setContracts(contractsResponse.data);
      setEstates(estatesResponse.data);
      setClients(clientsResponse.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const contractData = {
        ...formData,
        signing_date: new Date(formData.signing_date),
        validity_period: new Date(formData.validity_period),
        estate_id: formData.estate_id || undefined,
        agent_id: formData.agent_id || undefined,
        tenant_id: formData.tenant_id || undefined,
        renter_id: formData.renter_id || undefined
      };

      if (editingContract) {
        await contractApi.update(editingContract.contract_id, contractData);
      } else {
        await contractApi.create(contractData);
      }
      await fetchData();
      resetForm();
    } catch (err) {
      setError('Failed to save contract');
      console.error(err);
    }
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setFormData({
      contract_name: contract.contract_name,
      contract_status: contract.contract_status,
      signing_date: new Date(contract.signing_date).toISOString().split('T')[0],
      validity_period: new Date(contract.validity_period).toISOString().split('T')[0],
      notes: contract.notes || '',
      estate_id: contract.estate_id || 0,
      agent_id: contract.agent_id || 0,
      tenant_id: contract.tenant_id || 0,
      renter_id: contract.renter_id || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      try {
        await contractApi.delete(id);
        await fetchData();
      } catch (err) {
        setError('Failed to delete contract');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      contract_name: '',
      contract_status: '',
      signing_date: new Date().toISOString().split('T')[0],
      validity_period: new Date().toISOString().split('T')[0],
      notes: '',
      estate_id: 0,
      agent_id: 0,
      tenant_id: 0,
      renter_id: 0
    });
    setEditingContract(null);
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const getClientName = (clientId?: number) => {
    if (!clientId) return 'N/A';
    const client = clients.find(c => c.client_id === clientId);
    return client?.contact ? `${client.contact.name} ${client.contact.surname}` : `Client #${clientId}`;
  };

  const getEstateName = (estateId?: number) => {
    if (!estateId) return 'N/A';
    const estate = estates.find(e => e.estate_id === estateId);
    return estate ? estate.estate_name : `Estate #${estateId}`;
  };

  if (loading) return <div className="loading">Loading contracts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Contracts</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Contract
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingContract ? 'Edit Contract' : 'Add Contract'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Contract Name *</label>
                  <input
                    type="text"
                    name="contract_name"
                    value={formData.contract_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contract Status *</label>
                  <select
                    name="contract_status"
                    value={formData.contract_status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="terminated">Terminated</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Signing Date *</label>
                  <input
                    type="date"
                    name="signing_date"
                    value={formData.signing_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Validity Period *</label>
                  <input
                    type="date"
                    name="validity_period"
                    value={formData.validity_period}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Estate</label>
                  <select
                    name="estate_id"
                    value={formData.estate_id}
                    onChange={handleInputChange}
                  >
                    <option value={0}>Select estate</option>
                    {estates.map(estate => (
                      <option key={estate.estate_id} value={estate.estate_id}>
                        {estate.estate_name} - {estate.estate_type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Agent ID</label>
                  <input
                    type="number"
                    name="agent_id"
                    value={formData.agent_id}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tenant</label>
                  <select
                    name="tenant_id"
                    value={formData.tenant_id}
                    onChange={handleInputChange}
                  >
                    <option value={0}>Select tenant</option>
                    {clients.filter(c => c.typeofClient === 'tenant').map(client => (
                      <option key={client.client_id} value={client.client_id}>
                        {getClientName(client.client_id)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Renter</label>
                  <select
                    name="renter_id"
                    value={formData.renter_id}
                    onChange={handleInputChange}
                  >
                    <option value={0}>Select renter</option>
                    {clients.filter(c => c.typeofClient === 'renter').map(client => (
                      <option key={client.client_id} value={client.client_id}>
                        {getClientName(client.client_id)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingContract ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Signing Date</th>
              <th>Validity Period</th>
              <th>Estate</th>
              <th>Tenant</th>
              <th>Renter</th>
              <th>Agent ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr key={contract.contract_id}>
                <td>{contract.contract_id}</td>
                <td>{contract.contract_name}</td>
                <td>
                  <span className={`status ${contract.contract_status}`}>
                    {contract.contract_status}
                  </span>
                </td>
                <td>{new Date(contract.signing_date).toLocaleDateString()}</td>
                <td>{new Date(contract.validity_period).toLocaleDateString()}</td>
                <td>{getEstateName(contract.estate_id)}</td>
                <td>{getClientName(contract.tenant_id)}</td>
                <td>{getClientName(contract.renter_id)}</td>
                <td>{contract.agent_id || 'N/A'}</td>
                <td>
                  <div className="actions">
                    <button
                      onClick={() => handleEdit(contract)}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contract.contract_id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractsPage; 