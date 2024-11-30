import { getManager } from 'typeorm';
import { Product } from '../entity/Product';

export class ProductService {
  // Create a new product
  public async createProduct(data: { name: string, price: number, inventory: number }) {
    const productRepository = getManager().getRepository(Product);

    try {
      const product = new Product();
      product.name = data.name;
      product.price = data.price;
      product.inventory = data.inventory;

      // Save the product
      await productRepository.save(product);
      return product;
    } catch (error) {
      throw new Error('Failed to create product');
    }
  }
}
