import { Router } from 'express';
import { OrderController } from '../controller/OrderController';

const router = Router();
const orderController = new OrderController();

// Define route for updating order status
router.post('/update-status', orderController.updateOrderStatus.bind(orderController));
router.post('/create', orderController.addOrder.bind(orderController));

export default router;
