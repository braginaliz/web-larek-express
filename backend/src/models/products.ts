import mongoose, { Document, Types } from 'mongoose';

export interface IProduct extends Document {
    _id: Types.ObjectId
    title: string;
    image: { fileName: string; originalName: string };
    category: string;
    description?: string;
    price: number;
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: [2, 'минимальная длина поля - 2'],
    maxlength: [30, 'максимальная длина поля - 30'],
  },
  image: {
    fileName: { type: String, required: [true, 'Поле "fileName" обязательно для заполнения'] },
    originalName: { type: String, required: [true, 'Поле "originalName" обязательно для заполнения'] },
  },
  category: {
    type: String,
    required: [true, 'Поле "category" обязательно для заполнения'],
  },
  description: {
    type: String,
    required: false,
    maxlength: [500, 'Максимальная длина поля "description" - 500 символов'],
  },
  price: {
    type: Number,
    default: null,
    min: [0, 'Цена не может быть меньше 0'],
  },
});

export default mongoose.model<IProduct>('Product', productSchema);
