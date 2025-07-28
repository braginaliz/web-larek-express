import { Request, Response, NextFunction } from 'express';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/products';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

const getAllProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find();
    return res.send({ items: products, total: products.length });
  } catch (err) {
    return next(err);
  }
};

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      description, image, category, price, title,
    } = req.body;

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
      return next(new BadRequestError(error.message));
    }
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Продукт с таким значением уже существует.'));
    }
    return next(error);
  }
};

export default { getAllProducts, createProduct };
