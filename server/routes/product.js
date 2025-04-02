import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;

// const Product = require("../models/Product"); // Ensure correct path

// const addProduct = async (req, res) => {
//   try {
//     // Extract data from request
//     let { name, price } = req.body;

//     if (!name) {
//       return res.status(400).json({ error: "Product name is required" });
//     }

//     // Ensure price is a number
//     if (typeof price === "string") {
//       price = parseFloat(price.replace(/[^0-9.]/g, "")); // Remove "Rs" and convert to number
//     }

//     if (isNaN(price)) {
//       return res.status(400).json({ error: "Invalid price format" });
//     }

//     const newProduct = new Product({ name, price });
//     await newProduct.save();
    
//     res.status(201).json({ message: "Product added successfully", product: newProduct });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = { addProduct };

