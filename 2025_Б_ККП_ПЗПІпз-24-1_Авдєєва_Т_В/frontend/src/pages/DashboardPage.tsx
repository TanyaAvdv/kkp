import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../services/api.ts';
import StatCard from '../components/StatCard.tsx';
import ChartCard from '../components/ChartCard.tsx';
import { 
  UsersIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon, 
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  ArrowTrendingUpIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
          <div className="text-gray-600">{error}</div>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#10B981';
      case 'expired':
        return '#EF4444';
      case 'terminated':
        return '#6B7280';
      case 'pending':
        return '#F59E0B';
      case 'available':
        return '#3B82F6';
      case 'rented':
        return '#8B5CF6';
      case 'sold':
        return '#10B981';
      case 'reserved':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-blue-100 text-lg">Real Estate Management System Overview</p>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Total Contacts"
          value={overallStats?.contacts || 0}
          icon={<UsersIcon className="h-8 w-8" />}
          color="primary"
        />
        <StatCard
          title="Total Clients"
          value={overallStats?.clients || 0}
          icon={<UserGroupIcon className="h-8 w-8" />}
          color="secondary"
        />
        <StatCard
          title="Total Estates"
          value={overallStats?.estates || 0}
          icon={<BuildingOfficeIcon className="h-8 w-8" />}
          color="success"
        />
        <StatCard
          title="Active Contracts"
          value={contractStats?.active || 0}
          icon={<DocumentTextIcon className="h-8 w-8" />}
          color="warning"
        />
        <StatCard
          title="Total Requests"
          value={overallStats?.requests || 0}
          icon={<ClipboardDocumentListIcon className="h-8 w-8" />}
          color="info"
        />
        <StatCard
          title="Total Offers"
          value={overallStats?.offers || 0}
          icon={<TagIcon className="h-8 w-8" />}
          color="danger"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Client Types */}
        {clientStats?.byType && (
          <ChartCard
            title="Clients by Type"
            type="pie"
            data={Object.entries(clientStats.byType).map(([key, value]: [string, any]) => ({
              label: key.charAt(0).toUpperCase() + key.slice(1),
              value: value,
              color: key === 'tenant' ? '#3B82F6' : '#8B5CF6'
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Estate Pricing */}
        {estateStats?.pricing && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <ArrowTrendingUpIcon className="h-6 w-6 mr-2 text-green-600" />
              Estate Pricing Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Average Price:</span>
                <span className="text-lg font-bold text-gray-900">
                  ${estateStats.pricing.average.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Minimum Price:</span>
                <span className="text-lg font-bold text-gray-900">
                  ${estateStats.pricing.minimum.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Maximum Price:</span>
                <span className="text-lg font-bold text-gray-900">
                  ${estateStats.pricing.maximum.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activities */}
        {recentActivities && recentActivities.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <EyeIcon className="h-6 w-6 mr-2 text-blue-600" />
              Recent Activities
            </h3>
            <div className="space-y-4">
              {recentActivities.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'contract' ? 'bg-green-500' :
                    activity.type === 'request' ? 'bg-blue-500' :
                    activity.type === 'offer' ? 'bg-purple-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
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

export default DashboardPage; 