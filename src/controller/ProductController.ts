import { Request, Response } from 'express';
import { ProductService } from '../service/ProductService';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  // Handle product creation
  public async createProduct(req: Request, res: Response) {
    const { name, price, inventory } = req.body;

    // Validate the input
    if (!name || price === undefined || inventory === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Create the product using the service
      const product = await this.productService.createProduct({ name, price, inventory });

      // Return the success response
      return res.status(201).json({
        message: 'Product created successfully',
        productId: product.id,
      });
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({ error: 'Failed to create product' });
    }
  }
}
