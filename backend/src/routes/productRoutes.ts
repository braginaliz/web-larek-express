import { Router } from "express";
import {
  getAllProducts,
  createProduct,
} from "../controllers/productController";
import { productValidation } from '../middlewares/validation';


const productRoutes = Router();
productRoutes.get("/product", getAllProducts);
productRoutes.post("/product", productValidation, createProduct);

export default productRoutes;


import Product from '../models/products';
router.get('/product', async (req, res) => {
    try {
        const products = await Product.find(); 
        const total = products.length; 
        const response = {
            items: products,
            total: total
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

