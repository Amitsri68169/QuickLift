import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import { FiPhone, FiMessageSquare, FiMapPin } from 'react-icons/fi';

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [partnerLocation, setPartnerLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchOrder();
    connectSocket();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrder(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load order');
      setLoading(false);
    }
  };

  const connectSocket = () => {
    const token = localStorage.getItem('token');
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
    });

    newSocket.emit('join_room', orderId);

    newSocket.on('ORDER_TRACKING_UPDATE', (data) => {
      setPartnerLocation(data.currentLocation);
    });

    newSocket.on('ORDER_UPDATED', (data) => {
      setOrder((prev) => ({ ...prev, status: data.status }));
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">Order not found</p>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { status: 'PENDING_ASSIGNMENT', label: 'Pending' },
    { status: 'ASSIGNED', label: 'Partner Assigned' },
    { status: 'PICKED_UP', label: 'Picked Up' },
    { status: 'IN_PROGRESS', label: 'In Transit' },
    { status: 'DELIVERED', label: 'Delivered' },
  ];

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.status === order.status
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Order Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {order.orderId}
                </h1>
                <p className="text-gray-600">
                  Status:{' '}
                  <span className="font-semibold text-blue-600">
                    {order.status}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  ₹{order.cost.totalFare}
                </p>
                <p className="text-gray-600 text-sm">Total Fare</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6">Delivery Timeline</h2>
            <div className="space-y-4">
              {statusSteps.map((step, index) => (
                <div key={step.status} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index <= currentStepIndex
                        ? 'bg-green-600'
                        : 'bg-gray-300'
                    }`}
                  >
                    {index < currentStepIndex ? '✓' : index + 1}
                  </div>
                  <div className="ml-4 flex-1">
                    <p
                      className={`font-semibold ${
                        index <= currentStepIndex
                          ? 'text-gray-900'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                  {index <= currentStepIndex && (
                    <span className="text-sm text-gray-600">
                      {new Date().toLocaleTimeString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6">Locations</h2>

            <div className="mb-6">
              <div className="flex items-start">
                <FiMapPin className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Pickup Location</p>
                  <p className="text-gray-600">{order.pickupLocation.address}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Contact: {order.pickupLocation.contactPhone}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start">
                <FiMapPin className="text-red-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Delivery Location
                  </p>
                  <p className="text-gray-600">
                    {order.deliveryLocation.address}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Contact: {order.deliveryLocation.contactPhone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Partner Info */}
          {order.assignedPartner && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">Your Delivery Partner</h2>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {order.assignedPartner.name}
                  </p>
                  <p className="text-gray-600">
                    Rating: {'⭐'.repeat(Math.round(order.assignedPartner.rating))}
                  </p>
                  <p className="text-gray-600">
                    Vehicle: {order.assignedPartner.vehicle?.number}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center">
                    <FiPhone className="mr-2" /> Call
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center">
                    <FiMessageSquare className="mr-2" /> Chat
                  </button>
                </div>
              </div>

              {partnerLocation && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Partner Location</p>
                  <p className="text-sm text-gray-600">
                    Lat: {partnerLocation.latitude?.toFixed(4)}, Lng:{' '}
                    {partnerLocation.longitude?.toFixed(4)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Parcel Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Parcel Details</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 text-sm">Weight</p>
                <p className="font-semibold text-lg">{order.parcel.weight} kg</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Dimensions</p>
                <p className="font-semibold text-lg">
                  {order.parcel.dimensions}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Description</p>
                <p className="font-semibold text-lg">
                  {order.parcel.description}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Value</p>
                <p className="font-semibold text-lg">₹{order.parcel.value}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
