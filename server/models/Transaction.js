import mongoose from "mongoose";
import { loadType } from "mongoose-currency";

const Schema = mongoose.Schema;
loadType(mongoose);


const TransactionSchema = new Schema(
  {   _id: {
    type: mongoose.Schema.Types.ObjectId,  
    default: () => new mongoose.Types.ObjectId(), // ✅ Generates new ObjectId
  },
    buyer: {
      type: String,
      required: true,
    },
    amount: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
    },
    // productIds: [{ type: String}],
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true, toJSON: { getters: true } }
);

// const Transaction = mongoose.model("Transaction", TransactionSchema);

// export default Transaction;

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction ;

