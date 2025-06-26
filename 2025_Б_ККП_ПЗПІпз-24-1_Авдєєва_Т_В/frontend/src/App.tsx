import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './components/Navigation.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import ContactsPage from './pages/ContactsPage.tsx';
import ClientsPage from './pages/ClientsPage.tsx';
import AgentsPage from './pages/AgentsPage.tsx';
import EstatesPage from './pages/EstatesPage.tsx';
import ContractsPage from './pages/ContractsPage.tsx';
import RequestsPage from './pages/RequestsPage.tsx';
import OffersPage from './pages/OffersPage.tsx';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
