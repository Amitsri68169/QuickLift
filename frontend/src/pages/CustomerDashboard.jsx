import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiPlus, FiPackage, FiClock, FiCheckCircle } from 'react-icons/fi';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function CustomerDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      // Simulated data - replace with actual API calls
      setStats({
        totalOrders: 12,
        activeOrders: 1,
        completedOrders: 11,
      });
      setRecentOrders([
        {
          id: 'ORD_001',
          status: 'DELIVERED',
          fare: 299,
          from: '123 Main St',
          to: '456 Park Lane',
          date: '2026-05-13',
        },
        {
          id: 'ORD_002',
          status: 'IN_PROGRESS',
          fare: 199,
          from: '789 Market St',
          to: '321 Oak Ave',
          date: '2026-05-13',
        },
      ]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Deliveries</h1>
          <Button
            onClick={() => navigate('/book-order')}
            className="flex items-center gap-2"
          >
            <FiPlus /> Book Order
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalOrders}
                </p>
              </div>
              <FiPackage className="text-4xl text-blue-200" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Orders</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.activeOrders}
                </p>
              </div>
              <FiClock className="text-4xl text-yellow-200" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.completedOrders}
                </p>
              </div>
              <FiCheckCircle className="text-4xl text-green-200" />
            </div>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/order/${order.id}/track`)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {order.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.from} → {order.to}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{order.fare}</p>
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded ${
                        order.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
