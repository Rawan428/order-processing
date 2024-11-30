import { getManager } from 'typeorm';
import { Order } from '../entity/Order';
import { Product } from '../entity/Product';  // Import Product entity
import { connect, Channel, Connection } from 'amqplib';

export class OrderProcessingService {
  private channel: Channel;
  private connection: Connection;

  constructor() {
    this.init();
  }

  // Initialize RabbitMQ connection and channel
  async init() {
    try {
      this.connection = await connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue('orders', { durable: true });

      console.log('Listening for order events...');
      this.channel.consume('orders', this.processOrders.bind(this), { noAck: false });

      // Handle graceful shutdown
      process.on('SIGINT', this.cleanup.bind(this));
      process.on('SIGTERM', this.cleanup.bind(this));
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
    }
  }

  // Graceful shutdown function to close RabbitMQ connection and channel
  private async cleanup() {
    try {
      console.log('Closing RabbitMQ connection...');
      await this.channel.close();
      await this.connection.close();
      process.exit(0);
    } catch (error) {
      console.error('Error during cleanup:', error);
      process.exit(1);
    }
  }

  // Process incoming orders from the RabbitMQ queue
  async processOrders(msg: any) {
    if (!msg) {
      console.log('Invalid message received, skipping.');
      return;
    }

    const orderData = JSON.parse(msg.content.toString());
    const orderRepository = getManager().getRepository(Order);
    const productRepository = getManager().getRepository(Product);

    try {
      // Query the order based on orderId
      const order = await orderRepository.findOne({ where: { id: orderData.orderId }, relations: ['product'] });

      if (!order) {
        console.log(`Order with ID ${orderData.orderId} not found`);
        if (msg.fields) {
          this.channel.nack(msg, false, true); // Retry the message
        }
        return;
      }

      // Validate quantity
      const quantity = order.quantity;
      if (isNaN(quantity) || quantity <= 0) {
        console.log(`Invalid quantity for order ${orderData.orderId}: ${orderData.quantity}`);
        if (msg.fields) {
          this.channel.nack(msg, false, true); // Retry the message
        }
        return;
      }

      // Update order status
      order.status = orderData.status;

      // Fetch the associated product to check and update inventory
      const product = order.product;

      if (!product) {
        console.log(`Product not found for order ${orderData.orderId}`);
        if (msg.fields) {
          this.channel.nack(msg, false, true); // Retry the message
        }
        return;
      }

      // Ensure the product has enough inventory
      if (product.inventory < quantity) {
        console.log(`Insufficient inventory for order ${orderData.orderId}`);
        if (msg.fields) {
          this.channel.nack(msg, false, true); // Retry or reject the message
        }
        return;
      }

      // Update the product inventory
      product.inventory -= quantity;
      await productRepository.save(product);  // Save the updated product

      // Save the updated order
      await orderRepository.save(order);
      console.log(`Order ${orderData.orderId} processed successfully`);

      // Acknowledge the message if the order is processed successfully
      if (msg.fields) {
        this.channel.ack(msg); // Acknowledge the message
      }

    } catch (error) {
      console.error('Error processing order:', error);
      if (msg.fields) {
        this.channel.nack(msg, false, true); // Requeue the failed message
      }
    }
  }

}
