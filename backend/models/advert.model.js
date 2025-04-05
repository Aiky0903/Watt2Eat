import mongoose from "mongoose";

const advertSchema = new mongoose.Schema({
  // Who created the advert?
  deliveryStudent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Location Details
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
    required: true,
  },
  // Time & Availability
  departureTime: {
    type: Date,
    required: true,
  },
  estimatedReturnTime: {
    type: Date,
    required: true,
  },
  maxOrders: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 3, // Prevent overloading the deliverer
  },
  acceptedOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      validate: {
        validator: function (orders) {
          return orders.length <= this.maxOrders;
        },
        message: "Error: Max orders exceeded for this advert",
      },
    },
  ],
  // Status & Metadata
  status: {
    type: String,
    enum: ["active", "in_progress", "completed", "cancelled"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true, // Can't be modified after creation
  },
});

// Indexes for fast queries
// TTL Index for auto-expire
advertSchema.index({ createdAt: 1 }, { expireAfterSeconds: 20 });
advertSchema.index({ status: 1, createdAt: -1 });
advertSchema.index({ acceptedOrders: 1 }); // For order lookups

// Cascade delete hook
advertSchema.pre("deleteOne", { document: true }, async function (next) {
  try {
    await mongoose.model("Order").deleteMany({ advert: this._id });
    next();
  } catch (err) {
    next(new Error(`Failed to clean up orders: ${err.message}`));
  }
});

const Advert = mongoose.model("Advert", advertSchema);

export default Advert;
