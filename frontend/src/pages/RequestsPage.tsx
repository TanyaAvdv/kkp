import React, { useState, useEffect } from 'react';
import { requestApi, clientApi } from '../services/api';
import type { Request, Client } from '../types/entities';

const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Request | null>(null);
  const [formData, setFormData] = useState({
    request_name: '',
    request_date: new Date().toISOString().split('T')[0],
    request_type: '',
    square: 0,
    price: 0,
    currency: 'USD',
    country: '',
    city: '',
    rental_period_months: 0,
    notes: '',
    client_id: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requestsResponse, clientsResponse] = await Promise.all([
        requestApi.getAll(),
        clientApi.getAll()
      ]);
      setRequests(requestsResponse.data);
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
      const requestData = {
        ...formData,
        request_date: new Date(formData.request_date),
        client_id: formData.client_id || undefined,
        rental_period_months: formData.rental_period_months || undefined
      };

      if (editingRequest) {
        await requestApi.update(editingRequest.request_id, requestData);
      } else {
        await requestApi.create(requestData);
      }
      await fetchData();
      resetForm();
    } catch (err) {
      setError('Failed to save request');
      console.error(err);
    }
  };

  const handleEdit = (request: Request) => {
    setEditingRequest(request);
    setFormData({
      request_name: request.request_name,
      request_date: new Date(request.request_date).toISOString().split('T')[0],
      request_type: request.request_type,
      square: request.square,
      price: request.price,
      currency: request.currency,
      country: request.country,
      city: request.city,
      rental_period_months: request.rental_period_months || 0,
      notes: request.notes || '',
      client_id: request.client_id || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await requestApi.delete(id);
        await fetchData();
      } catch (err) {
        setError('Failed to delete request');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      request_name: '',
      request_date: new Date().toISOString().split('T')[0],
      request_type: '',
      square: 0,
      price: 0,
      currency: 'USD',
      country: '',
      city: '',
      rental_period_months: 0,
      notes: '',
      client_id: 0
    });
    setEditingRequest(null);
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

  if (loading) return <div className="loading">Loading requests...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Requests</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Request
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingRequest ? 'Edit Request' : 'Add Request'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Request Name *</label>
                  <input
                    type="text"
                    name="request_name"
                    value={formData.request_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Request Date *</label>
                  <input
                    type="date"
                    name="request_date"
                    value={formData.request_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Request Type *</label>
                  <input
                      type="text"
                      name="request_type"
                      value={formData.request_type}
                      onChange={handleInputChange}
                      required
                  />
                </div>
                <div className="form-group">
                  <label>Client</label>
                  <select
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleInputChange}
                  >
                    <option value={0}>Select client</option>
                    {clients.map(client => (
                      <option key={client.client_id} value={client.client_id}>
                        {getClientName(client.client_id)} ({client.typeofClient})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Square (m²) *</label>
                  <input
                    type="number"
                    name="square"
                    value={formData.square}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
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
                  </select>
                </div>
                <div className="form-group">
                  <label>Rental Period (months)</label>
                  <input
                    type="number"
                    name="rental_period_months"
                    value={formData.rental_period_months}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
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
                  {editingRequest ? 'Update' : 'Create'}
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
              <th>Date</th>
              <th>Type</th>
              <th>Square</th>
              <th>Price</th>
              <th>Location</th>
              <th>Client</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.request_id}>
                <td>{request.request_id}</td>
                <td>{request.request_name}</td>
                <td>{new Date(request.request_date).toLocaleDateString()}</td>
                <td>{request.request_type}</td>
                <td>{request.square} m²</td>
                <td>{request.price} {request.currency}</td>
                <td>{request.city}, {request.country}</td>
                <td>{getClientName(request.client_id)}</td>
                <td>
                  <div className="actions">
                    <button
                      onClick={() => handleEdit(request)}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(request.request_id)}
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

export default RequestsPage; 