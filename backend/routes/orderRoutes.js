import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateShippingStatus,
  updateOrderStatus, // Import the update function
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for creating a new order and retrieving all orders (admin only)
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);

// Route for retrieving current user's orders
router.route('/myorders').get(protect, getMyOrders);

// Route for getting a specific order by ID
router.route('/:id').get(protect, getOrderById);

// Route for updating payment status of an order
router.route('/:id/pay').put(protect, updateOrderToPaid);

// Route for marking an order as delivered (admin only)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

// Route for updating shipping status (admin only)
router.route('/update-shipping-status').post(protect, admin, updateShippingStatus);

// Route for updating order status with delivered and paid flags
router.post('/update-order/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { delivered, paid } = req.body; // Expecting boolean values

  try {
    const updatedOrder = await updateOrderStatus(orderId, { delivered, paid });

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

export default router;
