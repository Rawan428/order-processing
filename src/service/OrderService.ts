import { getManager } from 'typeorm';
import { Order } from '../entity/Order';
import { Product } from '../entity/Product';
import { OrderProcessingService } from './OrderProcessingService';  // Assuming this exists for processing orders

export class OrderService {
  private orderProcessingService: OrderProcessingService;

  constructor() {
    this.orderProcessingService = new OrderProcessingService();  // Initialize order processing service
  }

  // Update the order status
  public async updateOrderStatus(orderId: number, status: string) {
    const orderRepository = getManager().getRepository(Order);

    // Fetch the order from the database
    const order = await orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new Error('Order not found');
    }

    // Optionally, send the order update to RabbitMQ for processing
    await this.orderProcessingService.processOrders({
      content: JSON.stringify({ orderId, status }),
    });

    return 'Order status updated successfully';
  }

  // Add a new order
  public async addOrder(quantity: number, productId: number) {
    const orderRepository = getManager().getRepository(Order);
    const productRepository = getManager().getRepository(Product);

    // Fetch the product
    const product = await productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    // Check inventory
    if (product.inventory < quantity) {
      throw new Error('Insufficient inventory');
    }

    // Create a new order instance
    const order = new Order();
    order.status = "pending";
    order.quantity = quantity;
    order.product = product;  // Associate the product with the order

    // Reduce the product inventory
    product.inventory -= quantity;

    // Save the updated product and the new order
    await productRepository.save(product);
    await orderRepository.save(order);

    return order.id;  // Return the order ID
  }
}
