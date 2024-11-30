import { Request, Response } from 'express';
import { OrderService } from '../service/OrderService';  // Import the OrderService

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  // Handle updating order status
  public async updateOrderStatus(req: Request, res: Response) {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const message = await this.orderService.updateOrderStatus(orderId, status);
      res.status(200).json({ message });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }

  // Handle adding a new order
  public async addOrder(req: Request, res: Response) {
    const { quantity, productId } = req.body;

    // Validate input
    if (quantity === undefined || !productId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const orderId = await this.orderService.addOrder(quantity, productId);
      return res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (error) {
      console.error('Error adding order:', error);
      return res.status(500).json({ error: error.message || 'Failed to create order' });
    }
  }
}
