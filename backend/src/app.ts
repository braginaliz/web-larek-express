import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import productRoutes from "./routes/productRoutes";
import path from 'path';
const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect("mongodb://127.0.0.1:27017/weblarek", {
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(bodyParser.json());
app.use("/api", productRoutes);
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
