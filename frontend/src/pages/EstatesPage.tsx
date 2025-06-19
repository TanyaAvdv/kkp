import React, { useState, useEffect } from 'react';
import { estateApi, clientApi } from '../services/api';
import type { Estate, Client } from '../types/entities';

const EstatesPage: React.FC = () => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEstate, setEditingEstate] = useState<Estate | null>(null);
  const [formData, setFormData] = useState({
    estate_name: '',
    estate_status: '',
    estate_type: '',
    square: 0,
    price: 0,
    currency: 'USD',
    country: '',
    city: '',
    postal_code: '',
    street: '',
    placement_num: '',
    estate_rating: '',
    notes: '',
    agent_id: 0,
    tenant_id: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [estatesResponse, clientsResponse] = await Promise.all([
        estateApi.getAll(),
        clientApi.getAll()
      ]);
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
      const estateData = {
        ...formData,
        agent_id: formData.agent_id || undefined,
        tenant_id: formData.tenant_id || undefined
      };

      if (editingEstate) {
        await estateApi.update(editingEstate.estate_id, estateData);
      } else {
        await estateApi.create(estateData);
      }
      await fetchData();
      resetForm();
    } catch (err) {
      setError('Failed to save estate');
      console.error(err);
    }
  };

  const handleEdit = (estate: Estate) => {
    setEditingEstate(estate);
    setFormData({
      estate_name: estate.estate_name,
      estate_status: estate.estate_status,
      estate_type: estate.estate_type,
      square: estate.square,
      price: estate.price,
      currency: estate.currency,
      country: estate.country,
      city: estate.city,
      postal_code: estate.postal_code,
      street: estate.street,
      placement_num: estate.placement_num,
      estate_rating: estate.estate_rating,
      notes: estate.notes || '',
      agent_id: estate.agent_id || 0,
      tenant_id: estate.tenant_id || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this estate?')) {
      try {
        await estateApi.delete(id);
        await fetchData();
      } catch (err) {
        setError('Failed to delete estate');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      estate_name: '',
      estate_status: '',
      estate_type: '',
      square: 0,
      price: 0,
      currency: 'USD',
      country: '',
      city: '',
      postal_code: '',
      street: '',
      placement_num: '',
      estate_rating: '',
      notes: '',
      agent_id: 0,
      tenant_id: 0
    });
    setEditingEstate(null);
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

  if (loading) return <div className="loading">Loading estates...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Estates</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Estate
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingEstate ? 'Edit Estate' : 'Add Estate'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Estate Name *</label>
                  <input
                    type="text"
                    name="estate_name"
                    value={formData.estate_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Estate Status *</label>
                  <select
                    name="estate_status"
                    value={formData.estate_status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="sold">Sold</option>
                    <option value="reserved">Reserved</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Estate Type *</label>
                  <select
                    name="estate_type"
                    value={formData.estate_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estate Rating *</label>
                  <select
                    name="estate_rating"
                    value={formData.estate_rating}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
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
                  <label>Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
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
                <div className="form-group">
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Street *</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Placement Number *</label>
                  <input
                    type="text"
                    name="placement_num"
                    value={formData.placement_num}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
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
                  {editingEstate ? 'Update' : 'Create'}
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
              <th>Type</th>
              <th>Status</th>
              <th>Square</th>
              <th>Price</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Tenant</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {estates.map((estate) => (
              <tr key={estate.estate_id}>
                <td>{estate.estate_id}</td>
                <td>{estate.estate_name}</td>
                <td>{estate.estate_type}</td>
                <td>
                  <span className={`status ${estate.estate_status}`}>
                    {estate.estate_status}
                  </span>
                </td>
                <td>{estate.square} m²</td>
                <td>{estate.price} {estate.currency}</td>
                <td>
                  {estate.street} {estate.placement_num}, {estate.city}, {estate.country}
                </td>
                <td>{estate.estate_rating} ⭐</td>
                <td>{getClientName(estate.tenant_id)}</td>
                <td>
                  <div className="actions">
                    <button
                      onClick={() => handleEdit(estate)}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(estate.estate_id)}
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

export default EstatesPage; 