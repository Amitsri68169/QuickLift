import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import Table from '../components/Table';
import Loading from '../components/Loading';
import { FiUsers, FiPackage, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activePartners: 0,
    activeEnterprises: 0,
    pendingRequests: 0,
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      // Simulated data
      setStats({
        totalOrders: 5000,
        activePartners: 250,
        activeEnterprises: 45,
        pendingRequests: 12,
      });
      setPendingRequests([
        {
          id: 'REQ_001',
          type: 'DELIVERY_PARTNER',
          name: 'Rajesh Kumar',
          phone: '9876543210',
          status: 'PENDING',
        },
        {
          id: 'REQ_002',
          type: 'ENTERPRISE',
          name: 'XYZ Logistics',
          phone: '9876543211',
          status: 'PENDING',
        },
      ]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading admin dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
              </div>
              <FiPackage className="text-4xl text-blue-200" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Partners</p>
                <p className="text-3xl font-bold">{stats.activePartners}</p>
              </div>
              <FiUsers className="text-4xl text-green-200" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Enterprises</p>
                <p className="text-3xl font-bold">{stats.activeEnterprises}</p>
              </div>
              <FiTrendingUp className="text-4xl text-yellow-200" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Approvals</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.pendingRequests}
                </p>
              </div>
              <FiAlertCircle className="text-4xl text-red-200" />
            </div>
          </Card>
        </div>

        {/* Pending Requests Table */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Pending Approvals</h2>
          <Table
            columns={[
              { key: 'id', label: 'Request ID' },
              { key: 'type', label: 'Type' },
              { key: 'name', label: 'Name' },
              { key: 'phone', label: 'Phone' },
              {
                key: 'status',
                label: 'Status',
                render: (status) => (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {status}
                  </span>
                ),
              },
            ]}
            data={pendingRequests}
          />
        </Card>
      </div>
    </div>
  );
}
