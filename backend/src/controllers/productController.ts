import { Request, Response } from 'express';
import Product from '../models/products';

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении продуктов', error: err });
    }
};


export const createProduct = async (req: Request, res: Response) => {
    const { title, image, category, description, price } = req.body;

    const newProduct = new Product({
        title,
        image,
        category,
        description,
        price,
    });

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при создании продукта', error: err });
    }
};