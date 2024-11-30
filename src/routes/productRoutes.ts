import { Router } from 'express';
import { ProductController } from '../controller/ProductController';

const productController = new ProductController();
const router = Router();

// Route for creating a new product
router.post('/create', productController.createProduct.bind(productController));

export default router;
