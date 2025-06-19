import React, { useState, useEffect } from 'react';
import { clientApi, contactApi } from '../services/api';
import type { Client, Contact } from '../types/entities';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    typeofClient: 'tenant' as 'tenant' | 'renter',
    contact_id: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clientsResponse, contactsResponse] = await Promise.all([
        clientApi.getAll(),
        contactApi.getAll()
      ]);
      setClients(clientsResponse.data);
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
      const clientData = {
        ...formData,
        contact_id: formData.contact_id || undefined
      };

      if (editingClient) {
        await clientApi.update(editingClient.client_id, clientData);
      } else {
        await clientApi.create(clientData);
      }
      await fetchData();
      resetForm();
    } catch (err) {
      setError('Failed to save client');
      console.error(err);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      typeofClient: client.typeofClient,
      contact_id: client.contact_id || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientApi.delete(id);
        await fetchData();
      } catch (err) {
        setError('Failed to delete client');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      typeofClient: 'tenant',
      contact_id: 0
    });
    setEditingClient(null);
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'contact_id' ? Number(value) : value
    }));
  };

  const getContactName = (contactId?: number) => {
    if (!contactId) return 'N/A';
    const contact = contacts.find(c => c.contact_id === contactId);
    return contact ? `${contact.name} ${contact.surname}` : `Contact #${contactId}`;
  };

  if (loading) return <div className="loading">Loading clients...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Clients</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Client
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingClient ? 'Edit Client' : 'Add Client'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>Type of Client *</label>
                <select
                  name="typeofClient"
                  value={formData.typeofClient}
                  onChange={handleInputChange}
                  required
                >
                  <option value="tenant">Tenant</option>
                  <option value="renter">Renter</option>
                </select>
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
                  {editingClient ? 'Update' : 'Create'}
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
              <th>Type</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.client_id}>
                <td>{client.client_id}</td>
                <td>
                  <span className={`badge ${client.typeofClient}`}>
                    {client.typeofClient}
                  </span>
                </td>
                <td>{getContactName(client.contact_id)}</td>
                <td>{client.contact?.email || 'N/A'}</td>
                <td>{client.contact?.telephone || 'N/A'}</td>
                <td>
                  <div className="actions">
                    <button
                      onClick={() => handleEdit(client)}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(client.client_id)}
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

export default ClientsPage; 