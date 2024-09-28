import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model
    },
    orderItems: [
      {
        name: { type: String, required: true }, // Item name
        qty: { type: Number, required: true },  // Quantity
        image: { type: String, required: true }, // Image URL or path
        price: { type: Number, required: true }, // Price per item
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product', // Reference to Product model
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },   // Shipping address line
      city: { type: String, required: true },      // Shipping city
      postalCode: { type: String, required: true }, // Postal code
      country: { type: String, required: true },    // Country
    },
    paymentMethod: {
      type: String,
      required: true, // Payment method (e.g., "COD", "PayPal")
    },
    paymentResult: {
      id: { type: String },       // Payment result ID (for online payments)
      status: { type: String },   // Payment status (e.g., 'Completed')
      update_time: { type: String }, // Last update time for payment
      email_address: { type: String }, // Payer email address
    },
    totalAmount: {
      type: Number,
      required: true, // Total amount for the order (combining item prices, tax, and shipping)
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,  // Tax amount (if applicable)
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0, // Shipping cost (if any)
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0, // Total price (item cost + tax + shipping)
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false, // Payment status
    },
    paidAt: {
      type: Date, // Payment date (if paid)
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false, // Delivery status
    },
    deliveredAt: {
      type: Date, // Delivery date (if delivered)
    },
    createdAt: {
      type: Date,
      default: Date.now, // Order creation timestamp
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create and export the Order model
const Order = mongoose.model('Order', orderSchema);

export default Order;
