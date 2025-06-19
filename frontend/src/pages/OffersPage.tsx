import React, { useState, useEffect } from 'react';
import { offerApi, clientApi } from '../services/api';
import type { Offer, Client } from '../types/entities';

const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    offer_name: '',
    offer_date: new Date().toISOString().split('T')[0],
    offer_type: '',
    notes: '',
    client_id: 0,
    agent_id: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [offersResponse, clientsResponse] = await Promise.all([
        offerApi.getAll(),
        clientApi.getAll()
      ]);
      setOffers(offersResponse.data);
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
      const offerData = {
        ...formData,
        offer_date: new Date(formData.offer_date),
        client_id: formData.client_id || undefined,
        agent_id: formData.agent_id || undefined
      };

      if (editingOffer) {
        await offerApi.update(editingOffer.offer_id, offerData);
      } else {
        await offerApi.create(offerData);
      }
      await fetchData();
      resetForm();
    } catch (err) {
      setError('Failed to save offer');
      console.error(err);
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      offer_name: offer.offer_name,
      offer_date: new Date(offer.offer_date).toISOString().split('T')[0],
      offer_type: offer.offer_type,
      notes: offer.notes || '',
      client_id: offer.client_id || 0,
      agent_id: offer.agent_id || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await offerApi.delete(id);
        await fetchData();
      } catch (err) {
        setError('Failed to delete offer');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      offer_name: '',
      offer_date: new Date().toISOString().split('T')[0],
      offer_type: '',
      notes: '',
      client_id: 0,
      agent_id: 0
    });
    setEditingOffer(null);
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

  if (loading) return <div className="loading">Loading offers...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Offers</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Offer
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingOffer ? 'Edit Offer' : 'Add Offer'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Offer Name *</label>
                  <input
                    type="text"
                    name="offer_name"
                    value={formData.offer_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Offer Date *</label>
                  <input
                    type="date"
                    name="offer_date"
                    value={formData.offer_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Offer Type *</label>
                  <select
                    name="offer_type"
                    value={formData.offer_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="rent">Rent</option>
                    <option value="sale">Sale</option>
                    <option value="purchase">Purchase</option>
                  </select>
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
                  {editingOffer ? 'Update' : 'Create'}
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
              <th>Client</th>
              <th>Agent ID</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.offer_id}>
                <td>{offer.offer_id}</td>
                <td>{offer.offer_name}</td>
                <td>{new Date(offer.offer_date).toLocaleDateString()}</td>
                <td>{offer.offer_type}</td>
                <td>{getClientName(offer.client_id)}</td>
                <td>{offer.agent_id || 'N/A'}</td>
                <td>{offer.notes || 'N/A'}</td>
                <td>
                  <div className="actions">
                    <button
                      onClick={() => handleEdit(offer)}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(offer.offer_id)}
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

export default OffersPage; 