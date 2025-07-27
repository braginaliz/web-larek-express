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






