import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";  // Commented out
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import kpiRoutes from "./routes/kpi.js";
import productRoutes from "./routes/product.js";
import transactionRoutes from "./routes/transaction.js";
import KPI from "./models/KPI.js";
import Product from "./models/Product.js";
import Transaction from "./models/Transaction.js";
import { kpis, products, transactions } from "./data/data.js";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/kpi", kpiRoutes);
app.use("/product", productRoutes);
app.use("/transaction", transactionRoutes);

/* MONGOOSE SETUP - Commented out */
const PORT = process.env.PORT || 9000;
console.log("MongoDB URI:", process.env.MONGO_URL);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    
        /* ADD DATA ONE TIME ONLY */
        console.log("Resetting and inserting data into database...");
        await mongoose.connection.db.dropDatabase();
    
        await KPI.insertMany(
          kpis.map((kpi) => ({
            ...kpi,
            _id: new mongoose.Types.ObjectId(), // Ensure a new ObjectId is assigned
          }))
        );
    
        const insertedProducts = await Product.insertMany(
          products.map((product) => ({
            ...product,
            _id: new mongoose.Types.ObjectId(),
            transactions: product.transactions.map((txnId) => 
              mongoose.Types.ObjectId.isValid(txnId) ? new mongoose.Types.ObjectId(txnId) : null
            ).filter(Boolean), // Remove null values if transaction IDs are invalid
          }))
        );
        console.log("🚀 Transactions being inserted:");
        transactions.forEach((txn, index) => {
          console.log(`Transaction ${index + 1}:`, txn);
        });
        await Transaction.insertMany(
          transactions.map((txn) => ({
            ...txn,
            _id: new mongoose.Types.ObjectId(),
            buyer: txn.buyer_name,
            amount: Math.round(parseFloat(txn.amount) * 100), // Convert to currency format
            productIds: txn.productIds.map((id) => 
              mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null
            ).filter(Boolean), // Remove invalid productIds
          }))
        );
        console.log("Data inserted successfully!");
      })
.catch((error) => console.log(`Database connection failed: ${error}`));


  
/* BASIC SERVER TEST */
// const PORT = process.env.PORT || 9000;
// app.get("/", (req, res) => {
//   res.send("Server is running without MongoDB!");
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port: ${PORT}`);
// });
