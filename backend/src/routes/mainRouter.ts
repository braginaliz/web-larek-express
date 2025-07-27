import ordersRouter from './orderRoutes';
import productsRouter from './productRoutes';

const expressRouter = Router();

expressRouter.use('/products', productsRouter);
expressRouter.use('/orders', ordersRouter);

// Обработка несуществующих маршрутов
expressRouter.use((req, res, next) => {
    next(new NotFoundError('Данный маршрут не найден'));
});

export default expressRouter;