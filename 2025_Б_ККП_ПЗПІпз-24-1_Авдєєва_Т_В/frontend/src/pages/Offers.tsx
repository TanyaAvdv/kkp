import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { offersApi } from '../services/api.ts';
import type { Offer } from '../types/entities.ts';

const statusColors = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'error',
  expired: 'default',
} as const;

const typeLabels = {
  rent: 'Rent',
  sale: 'Sale',
} as const;

type StatusColor = typeof statusColors[keyof typeof statusColors];
type TypeLabel = typeof typeLabels[keyof typeof typeLabels];

export default function Offers() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<Offer['offer_status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Offer['offer_type'] | 'all'>('all');

  const { data: offers, isLoading, error } = useQuery({
    queryKey: ['offers', statusFilter, typeFilter],
    queryFn: async () => {
      if (statusFilter !== 'all' && typeFilter !== 'all') {
        const [statusOffers, typeOffers] = await Promise.all([
          offersApi.getByStatus(statusFilter).then(res => res.data),
          offersApi.getByType(typeFilter).then(res => res.data),
        ]);
        return statusOffers.filter((offer: Offer) => 
          typeOffers.some((t: Offer) => t.offer_id === offer.offer_id)
        );
      }
      if (statusFilter !== 'all') {
        return offersApi.getByStatus(statusFilter).then(res => res.data);
      }
      if (typeFilter !== 'all') {
        return offersApi.getByType(typeFilter).then(res => res.data);
      }
      return offersApi.getAll().then(res => res.data);
    },
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading offers</Typography>;
  }

  const filteredOffers = offers || [];
  const paginatedOffers = filteredOffers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Offers
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
        <TextField
          select
          fullWidth
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Offer['offer_status'] | 'all')}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="accepted">Accepted</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
          <MenuItem value="expired">Expired</MenuItem>
        </TextField>
        <TextField
          select
          fullWidth
          label="Type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as Offer['offer_type'] | 'all')}
        >
          <MenuItem value="all">All Types</MenuItem>
          <MenuItem value="rent">Rent</MenuItem>
          <MenuItem value="sale">Sale</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Offer Number</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Estate</TableCell>
              <TableCell>Agent</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOffers.map((offer: Offer) => (
              <TableRow key={offer.offer_id}>
                <TableCell>{offer.offer_number}</TableCell>
                <TableCell>{new Date(offer.offer_date).toLocaleDateString()}</TableCell>
                <TableCell>{typeLabels[offer.offer_type as keyof typeof typeLabels]}</TableCell>
                <TableCell>
                  <Chip
                    label={offer.offer_status}
                    color={statusColors[offer.offer_status as keyof typeof statusColors] as StatusColor}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {offer.price} {offer.currency}
                </TableCell>
                <TableCell>
                  {offer.client?.first_name} {offer.client?.last_name}
                </TableCell>
                <TableCell>{offer.estate?.title}</TableCell>
                <TableCell>
                  {offer.agent?.first_name} {offer.agent?.last_name}
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOffers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
} 