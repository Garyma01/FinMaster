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
import stateRevenueRoutes from "./routes/staterevenue.js";
import KPI from "./models/KPI.js";
import Product from "./models/Product.js";
import Transaction from "./models/Transaction.js";
import StateRevenue from "./models/StateRevenue.js";
import { kpis, products, transactions, stateRevenues } from "./data/data.js";

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
app.use('/staterevenue', stateRevenueRoutes);
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
        console.log("🔥 Database dropped successfully!");

        

        await KPI.insertMany(
          kpis.map((kpi) => ({
            ...kpi,
            _id: new mongoose.Types.ObjectId(), // Ensure a new ObjectId is assigned
          }))
        );
    
        const insertedProducts = await Product.insertMany(
          products.map((product) => ({
            ...product,
            // _id: new mongoose.Types.ObjectId(),
            id: product.id, 
            // _id: _id.toString(), 
            product_name: product.product_name,
            category: product.category,  // Ensure category is included
            sub_category: product.sub_category,
            price: product.price,
            expense: product.expense,
            totalQuantity: Number(product.totalQuantity), // Ensure it's a number
            totalSales: parseFloat(product.totalSales.replace(/[$,]/g, "")), // Convert to float  
            transactions: product.transactions.map(String),
            // transactions: product.transactions.map((txnId) => 
            //   mongoose.Types.ObjectId.isValid(txnId) ? new mongoose.Types.ObjectId(txnId) : null
            // ).filter(Boolean), // Remove null values if transaction IDs are invalid
          }))
        );
        console.log("✅ Inserted Products:", insertedProducts);

        console.log("🚀 Transactions being inserted:");
        transactions.forEach((txn, index) => {
          console.log(`Transaction ${index + 1}:`, txn);
        });
        // await Transaction.insertMany(
        //   transactions.map((txn) => ({
        //     ...txn,
        //     // _id: new mongoose.Types.ObjectId(),
        //     id: txn.id,
        //     buyer: txn.buyer_name,
        //     // amount: Math.round(parseFloat(txn.amount) * 100),
        //     //  // Convert to currency format
        //      amount: Math.round(parseFloat(txn.amount)),
        //     // productIds: txn.productIds.map((id) => 
        //     //   mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null
        //     // ).filter(Boolean), // Remove invalid productIds
        //     productIds: txn.productIds.map(String), 
        //   }))
        // );
        await Transaction.insertMany(
          transactions.map((txn, index) => {
            console.log(`🔍 Transaction ${index + 1} Original Amount:`, txn.amount);
        
            // Convert to string and remove any non-numeric characters except "."
            const cleanAmount = String(txn.amount).replace(/[^\d.]/g, "").replace(/,/g, ""); 
            const parsedAmount = cleanAmount ? parseFloat(cleanAmount) : 0; // Convert to float
        
            console.log(` Cleaned Amount:`, cleanAmount);
            console.log(` Parsed Amount:`, parsedAmount);
        
            if (isNaN(parsedAmount)) {
              console.error(` Error: Transaction ${index + 1} has an invalid amount:`, txn.amount);
            }
        
            return {
              id: txn.id,
              buyer: txn.buyer_name,
              amount: isNaN(parsedAmount) ? 0 : parsedAmount, // Keep decimal values
              productIds: txn.productIds.map(String),
            };
          })
        );
        console.log("🚀 StateRevenue being inserted:", stateRevenues);
        const validStateRevenues = stateRevenues
          .map((revenue) => ({
            state: revenue.State || "Unknown", // Fallback in case of missing state
            totalRevenue: revenue.Revenue ? parseFloat(revenue.Revenue.replace(/[$,]/g, "")) : 0,
          }))
          .filter((rev) => rev.totalRevenue !== NaN); // Filter out invalid entries

        console.log("📌 Valid State Revenues:", validStateRevenues);
        await StateRevenue.insertMany(validStateRevenues);

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

