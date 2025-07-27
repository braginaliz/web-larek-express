import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import routers from "./routes/mainRouter";
import path from 'path';
import { errorHandler } from "./middlewares/errorhandler"; 
import cors from 'cors';

const app = express();

app.use(cors()); 

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/api", routers);
app.use(express.static(path.join(__dirname, 'public')));


const bootstrap = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/weblarek');
    app.use(errorHandler); 
    await app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

bootstrap();