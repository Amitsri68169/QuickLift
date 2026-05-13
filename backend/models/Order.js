import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryPartner',
      default: null,
    },
    enterpriseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enterprise',
      default: null,
    },
    pickupLocation: {
      address: String,
      latitude: Number,
      longitude: Number,
      contactName: String,
      contactPhone: String,
    },
    deliveryLocation: {
      address: String,
      latitude: Number,
      longitude: Number,
      contactName: String,
      contactPhone: String,
    },
    parcel: {
      weight: Number,
      dimensions: String,
      value: Number,
      description: String,
      requiresSignature: Boolean,
    },
    vehicleType: {
      type: String,
      enum: ['bike', 'scooter', 'auto'],
      required: true,
    },
    status: {
      type: String,
      enum: [
        'PENDING_ASSIGNMENT',
        'ASSIGNED',
        'PICKED_UP',
        'IN_PROGRESS',
        'DELIVERED',
        'CANCELLED',
      ],
      default: 'PENDING_ASSIGNMENT',
    },
    cost: {
      baseFare: Number,
      distanceFare: Number,
      weightSurcharge: Number,
      tax: Number,
      totalFare: Number,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      default: 'PENDING',
    },
    paymentMethod: {
      type: String,
      enum: ['wallet', 'cash', 'card', 'upi'],
      default: 'wallet',
    },
    otp: {
      pickup: String,
      delivery: String,
    },
    deliveryProof: {
      photo: {
        url: String,
        key: String,
      },
      signature: {
        url: String,
        key: String,
      },
      timestamp: Date,
    },
    tracking: {
      startTime: Date,
      pickupTime: Date,
      deliveryTime: Date,
      estimatedDeliveryTime: Date,
    },
    cancelReason: String,
    rating: {
      score: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      timestamp: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
