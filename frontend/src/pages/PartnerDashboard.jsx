import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiDollarSign, FiPackage, FiTrendingUp, FiStar } from 'react-icons/fi';

export default function PartnerDashboard() {
  const [partner, setPartner] = useState(null);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    totalDeliveries: 0,
    rating: 0,
    activeOrders: 0,
  });
  const [status, setStatus] = useState('OFFLINE');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartnerData();
  }, []);

  const fetchPartnerData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/partners/${user.userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPartner(response.data.data);
      setStats({
        todayEarnings: 2500,
        totalDeliveries: response.data.data.totalDeliveries,
        rating: response.data.data.rating,
        activeOrders: 2,
      });
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load partner data');
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    const newStatus = status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    setStatus(newStatus);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/partners/${partner._id}/status`,
        {
          status: newStatus,
          currentLocation: { latitude: 26.8467, longitude: 80.9462 },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`Status changed to ${newStatus}`);
    } catch (error) {
      setStatus(status === 'ONLINE' ? 'OFFLINE' : 'ONLINE');
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome, {partner?.name}!
          </h1>
          <button
            onClick={handleStatusToggle}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition ${
              status === 'ONLINE'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {status === 'ONLINE' ? '🔴 Go Offline' : '🟢 Go Online'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Today's Earnings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Earnings</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{stats.todayEarnings}
                </p>
              </div>
              <FiDollarSign className="text-4xl text-green-600 opacity-20" />
            </div>
          </div>

          {/* Total Deliveries */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Deliveries</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalDeliveries}
                </p>
              </div>
              <FiPackage className="text-4xl text-blue-600 opacity-20" />
            </div>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Your Rating</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.rating.toFixed(1)} ⭐
                </p>
              </div>
              <FiStar className="text-4xl text-yellow-600 opacity-20" />
            </div>
          </div>

          {/* Active Orders */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Orders</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.activeOrders}
                </p>
              </div>
              <FiTrendingUp className="text-4xl text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Partner Info */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="font-semibold">{partner?.mobileNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">City</p>
                <p className="font-semibold">Lucknow</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className="font-semibold text-green-600">
                  {partner?.status}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Current Balance</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹5000
                </p>
              </div>
            </div>
          </div>

          {/* Service Area */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Service Area</h2>
            <div>
              <p className="text-gray-600 text-sm mb-3">Radius</p>
              <p className="text-2xl font-bold mb-4">
                {partner?.serviceArea?.radius || 20} km
              </p>
              <p className="text-gray-600 text-sm mb-3">Areas Covered</p>
              <div className="flex flex-wrap gap-2">
                {partner?.serviceArea?.areas?.map((area) => (
                  <span
                    key={area}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
