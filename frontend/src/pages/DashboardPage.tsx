import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../services/api';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';

const DashboardPage: React.FC = () => {
  const [overallStats, setOverallStats] = useState<any>(null);
  const [clientStats, setClientStats] = useState<any>(null);
  const [estateStats, setEstateStats] = useState<any>(null);
  const [contractStats, setContractStats] = useState<any>(null);
  const [requestStats, setRequestStats] = useState<any>(null);
  const [offerStats, setOfferStats] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        overallResponse,
        clientResponse,
        estateResponse,
        contractResponse,
        requestResponse,
        offerResponse,
        activitiesResponse
      ] = await Promise.all([
        dashboardApi.getOverallStats(),
        dashboardApi.getClientStats(),
        dashboardApi.getEstateStats(),
        dashboardApi.getContractStats(),
        dashboardApi.getRequestStats(),
        dashboardApi.getOfferStats(),
        dashboardApi.getRecentActivities()
      ]);

      setOverallStats(overallResponse.data);
      setClientStats(clientResponse.data);
      setEstateStats(estateResponse.data);
      setContractStats(contractResponse.data);
      setRequestStats(requestResponse.data);
      setOfferStats(offerResponse.data);
      setRecentActivities(activitiesResponse.data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Real Estate Management System Overview</p>
      </div>

      {/* Overall Statistics */}
      <div className="stats-grid">
        <StatCard
          title="Total Contacts"
          value={overallStats?.contacts || 0}
          icon="👥"
          color="primary"
        />
        <StatCard
          title="Total Clients"
          value={overallStats?.clients || 0}
          icon="🏢"
          color="secondary"
        />
        <StatCard
          title="Total Estates"
          value={overallStats?.estates || 0}
          icon="🏠"
          color="success"
        />
        <StatCard
          title="Active Contracts"
          value={contractStats?.active || 0}
          icon="📋"
          color="warning"
        />
        <StatCard
          title="Total Requests"
          value={overallStats?.requests || 0}
          icon="📝"
          color="info"
        />
        <StatCard
          title="Total Offers"
          value={overallStats?.offers || 0}
          icon="💼"
          color="danger"
        />
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Client Types */}
        {clientStats?.byType && (
          <ChartCard
            title="Clients by Type"
            type="pie"
            data={Object.entries(clientStats.byType).map(([key, value]: [string, any]) => ({
              label: key.charAt(0).toUpperCase() + key.slice(1),
              value: value,
              color: key === 'tenant' ? '#1976d2' : '#7b1fa2'
            }))}
          />
        )}

        {/* Estate Types */}
        {estateStats?.byType && (
          <ChartCard
            title="Estates by Type"
            type="bar"
            data={Object.entries(estateStats.byType).map(([key, value]: [string, any]) => ({
              label: key.charAt(0).toUpperCase() + key.slice(1),
              value: value
            }))}
          />
        )}

        {/* Estate Status */}
        {estateStats?.byStatus && (
          <ChartCard
            title="Estates by Status"
            type="pie"
            data={Object.entries(estateStats.byStatus).map(([key, value]: [string, any]) => ({
              label: key.charAt(0).toUpperCase() + key.slice(1),
              value: value,
              color: getStatusColor(key)
            }))}
          />
        )}

        {/* Contract Status */}
        {contractStats?.byStatus && (
          <ChartCard
            title="Contracts by Status"
            type="bar"
            data={Object.entries(contractStats.byStatus).map(([key, value]: [string, any]) => ({
              label: key.charAt(0).toUpperCase() + key.slice(1),
              value: value
            }))}
          />
        )}

        {/* Request Types */}
        {requestStats?.byType && (
          <ChartCard
            title="Requests by Type"
            type="pie"
            data={Object.entries(requestStats.byType).map(([key, value]: [string, any]) => ({
              label: key.charAt(0).toUpperCase() + key.slice(1),
              value: value
            }))}
          />
        )}

        {/* Monthly Contract Trend */}
        {contractStats?.monthlyTrend && contractStats.monthlyTrend.length > 0 && (
          <ChartCard
            title="Contract Signing Trend (Last 12 Months)"
            type="line"
            data={contractStats.monthlyTrend.map((item: any) => ({
              label: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
              value: item.count
            }))}
          />
        )}
      </div>

      {/* Additional Info Section */}
      <div className="info-grid">
        {/* Estate Pricing */}
        {estateStats?.pricing && (
          <div className="info-card">
            <h3>Estate Pricing Overview</h3>
            <div className="pricing-stats">
              <div className="pricing-item">
                <span className="label">Average Price:</span>
                <span className="value">${estateStats.pricing.average.toLocaleString()}</span>
              </div>
              <div className="pricing-item">
                <span className="label">Minimum Price:</span>
                <span className="value">${estateStats.pricing.minimum.toLocaleString()}</span>
              </div>
              <div className="pricing-item">
                <span className="label">Maximum Price:</span>
                <span className="value">${estateStats.pricing.maximum.toLocaleString()}</span>
              </div>
              <div className="pricing-item">
                <span className="label">Average Square:</span>
                <span className="value">{estateStats.averageSquare.toFixed(1)} m²</span>
              </div>
            </div>
          </div>
        )}



        {/* Recent Activities */}
        {recentActivities.length > 0 && (
          <div className="info-card">
            <h3>Recent Activities</h3>
            <div className="activities-list">
              {recentActivities.slice(0, 8).map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className={`activity-type ${activity.type}`}>
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </div>
                  <div className="activity-info">
                    <span className="activity-name">{activity.name}</span>
                    <span className="activity-date">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    available: '#4caf50',
    rented: '#2196f3',
    sold: '#f44336',
    reserved: '#ff9800',
    active: '#4caf50',
    expired: '#f44336',
    terminated: '#9e9e9e',
    pending: '#ff9800'
  };
  return colors[status] || '#1976d2';
};

export default DashboardPage; 