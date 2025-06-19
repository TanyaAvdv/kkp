import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { offersApi, clientsApi, estatesApi, agentsApi } from '../services/api';
import type { Offer, Client, Estate, Agent } from '../types/entities';

interface OfferFormProps {
  open: boolean;
  onClose: () => void;
  offer?: Offer;
  onSubmit: (data: Omit<Offer, 'offer_id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

type FormField = keyof Omit<Offer, 'offer_id' | 'created_at' | 'updated_at'>;
type IdField = 'client_id' | 'estate_id' | 'agent_id';

export default function OfferForm({ open, onClose, offer, onSubmit }: OfferFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<Offer>>({
    offer_number: '',
    offer_date: new Date(),
    offer_type: 'sale',
    offer_status: 'pending',
    price: 0,
    currency: 'USD',
    deposit_amount: null,
    commission_amount: 0,
    commission_currency: 'USD',
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    notes: '',
    estate_id: undefined,
    client_id: undefined,
    agent_id: undefined,
  });

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.getAll().then(res => res.data),
  });

  const { data: estates } = useQuery({
    queryKey: ['estates'],
    queryFn: () => estatesApi.getAll().then(res => res.data),
  });

  const { data: agents } = useQuery({
    queryKey: ['agents'],
    queryFn: () => agentsApi.getAll().then(res => res.data),
  });

  useEffect(() => {
    if (offer) {
      setFormData({
        ...offer,
        offer_date: new Date(offer.offer_date),
        valid_until: new Date(offer.valid_until),
      });
    }
  }, [offer]);

  const handleTextChange = (field: FormField) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleNumberChange = (field: FormField) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value === '' ? '' : Number(event.target.value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: FormField) => (
    event: SelectChangeEvent
  ) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleDateChange = (field: 'offer_date' | 'valid_until') => (date: Date | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, [field]: date }));
    }
  };

  const handleIdChange = (field: IdField) => (
    event: SelectChangeEvent<string>
  ) => {
    const value = event.target.value === '' ? undefined : Number(event.target.value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await onSubmit(formData as Omit<Offer, 'offer_id' | 'created_at' | 'updated_at'>);
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      onClose();
    } catch (error) {
      console.error('Error submitting offer:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{offer ? 'Edit Offer' : 'Create New Offer'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <TextField
              required
              fullWidth
              label="Offer Number"
              value={formData.offer_number}
              onChange={handleTextChange('offer_number')}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Offer Date"
                value={formData.offer_date}
                onChange={handleDateChange('offer_date')}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </LocalizationProvider>
            <FormControl fullWidth required>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.offer_type}
                label="Type"
                onChange={handleSelectChange('offer_type')}
              >
                <MenuItem value="sale">Sale</MenuItem>
                <MenuItem value="rent">Rent</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.offer_status}
                label="Status"
                onChange={handleSelectChange('offer_status')}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="accepted">Accepted</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
              </Select>
            </FormControl>
            <TextField
              required
              fullWidth
              type="number"
              label="Price"
              value={formData.price}
              onChange={handleNumberChange('price')}
              InputProps={{ inputProps: { min: 0 } }}
            />
            <TextField
              required
              fullWidth
              label="Currency"
              value={formData.currency}
              onChange={handleTextChange('currency')}
            />
            {formData.offer_type === 'rent' && (
              <TextField
                required
                fullWidth
                type="number"
                label="Deposit Amount"
                value={formData.deposit_amount || ''}
                onChange={handleNumberChange('deposit_amount')}
                InputProps={{ inputProps: { min: 0 } }}
              />
            )}
            <TextField
              required
              fullWidth
              type="number"
              label="Commission Amount"
              value={formData.commission_amount}
              onChange={handleNumberChange('commission_amount')}
              InputProps={{ inputProps: { min: 0 } }}
            />
            <TextField
              required
              fullWidth
              label="Commission Currency"
              value={formData.commission_currency}
              onChange={handleTextChange('commission_currency')}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Valid Until"
                value={formData.valid_until}
                onChange={handleDateChange('valid_until')}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </LocalizationProvider>
            <FormControl fullWidth required>
              <InputLabel>Client</InputLabel>
              <Select
                value={formData.client_id?.toString() || ''}
                label="Client"
                onChange={handleIdChange('client_id')}
              >
                {clients?.map((client: Client) => (
                  <MenuItem key={client.client_id} value={client.client_id.toString()}>
                    {client.first_name} {client.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Estate</InputLabel>
              <Select
                value={formData.estate_id?.toString() || ''}
                label="Estate"
                onChange={handleIdChange('estate_id')}
              >
                {estates?.map((estate: Estate) => (
                  <MenuItem key={estate.estate_id} value={estate.estate_id.toString()}>
                    {estate.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Agent</InputLabel>
              <Select
                value={formData.agent_id?.toString() || ''}
                label="Agent"
                onChange={handleIdChange('agent_id')}
              >
                {agents?.map((agent: Agent) => (
                  <MenuItem key={agent.agent_id} value={agent.agent_id.toString()}>
                    {agent.first_name} {agent.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notes"
              value={formData.notes || ''}
              onChange={handleTextChange('notes')}
              sx={{ gridColumn: '1 / -1' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {offer ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 