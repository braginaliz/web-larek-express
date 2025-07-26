import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import productRoutes from "./routes/productRoutes";
import path from 'path';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/api", productRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const bootstrap = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/weblarek');
    app.use(routers);
    await app.listen(PORT, () => console.log('ok'));
  } catch (error) {
    console.error(error);
  }
};

bootstrap();