import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { errors } from 'celebrate';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import errorHandler from './middlewares/errorhandler';
import NotFoundError from './errors/not-found-error';
import { requestLogger, errorLogger } from './middlewares/logger';
import { PORT, DB_ADDRESS } from './config';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Слишком много запросов с вашего IP, попробуйте снова позже.', 
  standardHeaders: true, 
  legacyHeaders: false,
});


app.use(limiter);


app.use(requestLogger);


app.use('/product', productRoutes);
app.use('/order', orderRoutes);


app.use('*', (_req, _res, next) => {
  next(new NotFoundError('Не найден маршрут'));
});


app.use(errorLogger);


app.use(errors());
app.use(errorHandler);


mongoose.connect(DB_ADDRESS)
  .then(() => {
    console.log('Успешно подключение к MongoDB');
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
  });

app.listen(PORT, () => {
  console.log(`Запускается на сервере: ${PORT}`);
});