import React, { useState, useEffect } from 'react';
import { agentApi, contactApi } from '../services/api';
import type { Agent, Contact } from '../types/entities';

const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    agent_rating: '',
    post_name: '',
    salary: 0,
    currency: 'USD',
    hiring_date: '',
    dismissal_date: '',
    department_name: '',
    contact_id: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [agentsResponse, contactsResponse] = await Promise.all([
        agentApi.getAll(),
        contactApi.getAll()
      ]);
      setAgents(agentsResponse.data);
      setContacts(contactsResponse.data);
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
      const agentData = {
        ...formData,
        contact_id: formData.contact_id || undefined,
        hiring_date: new Date(formData.hiring_date),
        dismissal_date: formData.dismissal_date ? new Date(formData.dismissal_date) : undefined
      };

      if (editingAgent) {
        await agentApi.update(editingAgent.agent_id, agentData);
      } else {
        await agentApi.create(agentData);
      }
      await fetchData();
      resetForm();
    } catch (err) {
      setError('Failed to save agent');
      console.error(err);
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      agent_rating: agent.agent_rating,
      post_name: agent.post_name,
      salary: agent.salary,
      currency: agent.currency,
      hiring_date: agent.hiring_date ? new Date(agent.hiring_date).toISOString().split('T')[0] : '',
      dismissal_date: agent.dismissal_date ? new Date(agent.dismissal_date).toISOString().split('T')[0] : '',
      department_name: agent.department_name,
      contact_id: agent.contact_id || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await agentApi.delete(id);
        await fetchData();
      } catch (err) {
        setError('Failed to delete agent');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      agent_rating: '',
      post_name: '',
      salary: 0,
      currency: 'USD',
      hiring_date: '',
      dismissal_date: '',
      department_name: '',
      contact_id: 0
    });
    setEditingAgent(null);
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'contact_id' || name === 'salary' ? Number(value) : value
    }));
  };

  const getContactName = (contactId?: number) => {
    if (!contactId) return 'N/A';
    const contact = contacts.find(c => c.contact_id === contactId);
    return contact ? `${contact.name} ${contact.surname}` : `Contact #${contactId}`;
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const formatSalary = (salary: number, currency: string) => {
    return `${salary.toLocaleString()} ${currency}`;
  };

  if (loading) return <div className="loading">Loading agents...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Agents</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Agent
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingAgent ? 'Edit Agent' : 'Add Agent'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Agent Rating *</label>
                  <input
                    type="text"
                    name="agent_rating"
                    value={formData.agent_rating}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Post Name *</label>
                  <input
                    type="text"
                    name="post_name"
                    value={formData.post_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Salary *</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Currency *</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="UAH">UAH</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Hiring Date *</label>
                  <input
                    type="date"
                    name="hiring_date"
                    value={formData.hiring_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Dismissal Date</label>
                  <input
                    type="date"
                    name="dismissal_date"
                    value={formData.dismissal_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Department Name *</label>
                <input
                  type="text"
                  name="department_name"
                  value={formData.department_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact</label>
                <select
                  name="contact_id"
                  value={formData.contact_id}
                  onChange={handleInputChange}
                >
                  <option value={0}>Select contact</option>
                  {contacts.map(contact => (
                    <option key={contact.contact_id} value={contact.contact_id}>
                      {contact.name} {contact.surname} - {contact.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAgent ? 'Update' : 'Create'}
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
              <th>Rating</th>
              <th>Post</th>
              <th>Contact</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Hiring Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.agent_id}>
                <td>{agent.agent_id}</td>
                <td>
                  <span className="badge rating">
                    {agent.agent_rating}
                  </span>
                </td>
                <td>{agent.post_name}</td>
                <td>{getContactName(agent.contact_id)}</td>
                <td>{agent.department_name}</td>
                <td>{formatSalary(agent.salary, agent.currency)}</td>
                <td>{formatDate(agent.hiring_date)}</td>
                <td>
                  <span className={`badge ${agent.dismissal_date ? 'inactive' : 'active'}`}>
                    {agent.dismissal_date ? 'Dismissed' : 'Active'}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button
                      onClick={() => handleEdit(agent)}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(agent.agent_id)}
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

export default AgentsPage; 