import mongoose from "mongoose";

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
    // Status & Timestamps
    status: {
      type: String,
      enum: ["pending", "accepted", "in_progress", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

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

const Order = mongoose.model("Order", orderSchema);

export default Order;
