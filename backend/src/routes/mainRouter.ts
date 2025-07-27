import ordersRouter from './orderRoutes';
import productsRouter from './productRoutes';
import {  Router } from 'express';
import { NextFunction, Request, Response } from 'express';

const routers = Router();
routers.use('/products', productsRouter);
routers.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'Данный маршрут не найден' });
});

export default routers;