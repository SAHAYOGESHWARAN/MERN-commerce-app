import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
  } = req.body;

  // Validate input fields
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  // Calculate itemsPrice
  const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Ensure taxPrice and shippingPrice are numbers
  const tax = parseFloat(taxPrice) || 0;
  const shipping = parseFloat(shippingPrice) || 0;

  // Calculate totalAmount
  const totalAmount = itemsPrice + tax + shipping;

  // Check if totalAmount is a valid number
  if (isNaN(totalAmount)) {
    res.status(400);
    throw new Error('Invalid total amount calculation');
  }

  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice: tax,
    shippingPrice: shipping,
    totalPrice: totalAmount,
    totalAmount: totalAmount,
    isPaid: paymentMethod === 'COD' ? false : true, // Handle COD
    paidAt: paymentMethod === 'COD' ? null : Date.now(),
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true; // Mark as paid
    order.paidAt = Date.now(); // Update payment date
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true; // Mark as delivered
    order.deliveredAt = Date.now(); // Update delivery date

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Update shipping status
// @route   POST /api/orders/update-shipping-status
// @access  Private/Admin
const updateShippingStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isDelivered = true; // Mark as delivered
    order.deliveredAt = Date.now(); // Update delivery date
    const updatedOrder = await order.save();

    res.json({ message: 'Shipping status updated to Delivered', updatedOrder });
  } catch (error) {
    console.error('Error updating shipping status:', error);
    res.status(500).json({ message: 'Failed to update shipping status', error });
  }
});

// @desc    Update order status (delivered and paid)
// @route   POST /api/orders/update-order/:orderId
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { delivered, paid } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { isDelivered: delivered, isPaid: paid },
      { new: true }
    );

    if (updatedOrder) {
      return res.status(200).json({
        message: 'Order updated successfully',
        order: updatedOrder,
      });
    } else {
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateShippingStatus,
  updateOrderStatus,
};
