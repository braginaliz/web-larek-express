import { faker } from '@faker-js/faker';
import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import HttpCodes from '../errors/http-codes';
import Product, { IProduct } from '../models/products';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find<IProduct>({});
    const { total, items } = req.body;

    const basket: IProduct[] = items.map((id: string) => {
      const product = products.find((p) => p._id.equals(id));
      if (!product) {
        throw new BadRequestError(`Товар с id ${id} не найден`);
      }
      if (product.price === null) {
        throw new BadRequestError(`Товар с id ${id} снят с продажи`);
      }
      return product;
    });

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
    if (error instanceof MongooseError.ValidationError || error instanceof BadRequestError) {
      return next(new BadRequestError(error.message));
    }
    return next(new BadRequestError('Ошибка при создании заказа'));
  }
};

export default createOrder;
