import { Router } from 'express';
import productController from '../controllers/productController'; // Импортируем объект контроллера
import { productValidation } from '../middlewares/validation';

const productRoutes = Router();
productRoutes.get('/', productController.getAllProducts); // Используем getAllProducts из объекта контроллера
productRoutes.post('/', productValidation, productController.createProduct); // Используем createProduct

export default productRoutes;
