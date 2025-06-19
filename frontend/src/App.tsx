import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navigation from './components/Navigation';
import DashboardPage from './pages/DashboardPage';
import ContactsPage from './pages/ContactsPage';
import ClientsPage from './pages/ClientsPage';
import AgentsPage from './pages/AgentsPage';
import EstatesPage from './pages/EstatesPage';
import ContractsPage from './pages/ContractsPage';
import RequestsPage from './pages/RequestsPage';
import OffersPage from './pages/OffersPage';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navigation>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/estates" element={<EstatesPage />} />
              <Route path="/contracts" element={<ContractsPage />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/offers" element={<OffersPage />} />

            </Routes>
          </Navigation>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
