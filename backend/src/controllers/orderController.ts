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


        for (const id of items) {
            const product = products.find((p) => p._id.equals(id));
            if (!product) {
                return next(new BadRequestError(`Товар с id ${id} не найден`));
            }
            if (product.price === null) {
                return next(new BadRequestError(`Товар с id ${id} снят с продажи`));
            }
            basket.push(product);
        }


        const totalBasket = basket.reduce((a, c) => a + c.price, 0);
        if (totalBasket !== total) {
            return next(new BadRequestError('Неверная сумма заказа'));
        }


        return res.status(HttpCodes.CREATED).json({
            id: faker.string.uuid(),
            total,
            items: basket,
        });
    } catch (error) {
        if (error instanceof MongooseError.ValidationError) {
            return next(new BadRequestError(error.message));
        }
        return next(new BadRequestError('Ошибка при создании заказа'));
    }
};