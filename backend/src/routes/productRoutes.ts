import { Router } from "express";
import {
  getAllProducts,
  createProduct,
} from "../controllers/productController";
import Product from '../models/products';

const router = Router();
router.get("/product", getAllProducts);
router.post("/product", createProduct);


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
export default router;
