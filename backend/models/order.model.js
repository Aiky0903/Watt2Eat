import mongoose from "mongoose";
import Advert from "./advert.model.js";
import dotenv from "dotenv";
dotenv.config();

const orderItemSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foodItemSchema", // Reference to the food item
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    priceAtOrder: {
      // Snapshot of price when ordered
      type: Number,
      required: true,
    },
  },
  { _id: false }
); // No need for separate IDs for items

const orderSchema = new mongoose.Schema(
  {
    // Who placed the order?
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Which advert is this order tied to?
    advert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advert",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    // The actual food order
    items: [orderItemSchema],
    // Status & Timestamps
    status: {
      type: String,
      enum: ["pending", "accepted", "in_progress", "delivered", "cancelled"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-populate restaurant and calculate total
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const advert = await Advert.findById(this.advert).populate({
        path: "restaurant",
        select: "name",
      });

      this.restaurant = advert.restaurant._id;

      // Calculate total (items.reduce + delivery fee)
      this.totalAmount = this.items.reduce(
        (sum, item) => sum + item.priceAtOrder * item.quantity,
        this.deliveryFee
      );
    } catch (err) {
      return next(err);
    }
  }
  next();
});

orderSchema.post("save", async function (doc) {
  try {
    const advert = await mongoose.model("Advert").findById(doc.advert);
    if (
      doc.status === "accepted" &&
      advert.acceptedOrders.length >= advert.maxOrders
    ) {
      throw new Error(
        `Advert ${doc.advert} has reached max orders (${advert.maxOrders})`
      );
    }
    if (doc.status === "accepted") {
      // Add to acceptedOrders if not already present
      if (!advert.acceptedOrders.some((id) => id.equals(doc._id))) {
        await mongoose.model("Advert").findByIdAndUpdate(doc.advert, {
          $addToSet: { acceptedOrders: doc._id },
        });
      }
    } else if (advert.acceptedOrders.some((id) => id.equals(doc._id))) {
      // Remove if status changed from accepted
      await mongoose.model("Advert").findByIdAndUpdate(doc.advert, {
        $pull: { acceptedOrders: doc._id },
      });
    }
  } catch (err) {
    console.error("Error updating advert:", err);
    // Consider adding error handling/retry logic here
  }
});

// Indexes
orderSchema.index({ customer: 1 }); // All orders by a user
orderSchema.index({ advert: 1 }); // All orders for an advert
orderSchema.index({ status: 1 }); // Filter by status
orderSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: parseInt(process.env.ADVERT_EXPIRY) }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
