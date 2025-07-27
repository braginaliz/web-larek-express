import { faker } from '@faker-js/faker';
import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError, Types } from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import {HttpCodes} from '../errors/http-codes';
import Product, { IProduct } from '../models/products';


export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const basket: IProduct[] = [];
        const products = await Product.find<IProduct>({});
        const { total, items } = req.body;

        items.forEach((id: Types.ObjectId) => {
            const product = products.find((p) => p._id.equals(id));
            if (!product) {
                return next(new BadRequestError(`Товар с id ${id} не найден`));
            }
            basket.push(product);
        });

        return res.status(HttpCodes.CREATED).send({ total, items: basket });
    } catch (error) {
        return next(new BadRequestError('Ошибка при создании заказа', error));
    }
};