import { Request, Response, NextFunction } from 'express';
import Product from '../models/products';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';


export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        return res.send({ items: products, total: products.length });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении продуктов', error: err });
    }
};


export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { description, image, category, price, title } = req.body;

        const product = await Product.create({
            description,
            image,
            category,
            price,
            title,
        });

        return res.status(constants.HTTP_STATUS_CREATED).send(product);
    } catch (error) {
        if (error instanceof MongooseError.ValidationError) {
            const message = Object.values(error.errors).map((err) => err.message).join(', ');
            return next(new BadRequestError(message));
        }
        if (error instanceof Error && error.message.includes('E11000')) {
            return next(new ConflictError('Продукт с таким значением уже существует.'));
        }
        return next(error);
    }
};