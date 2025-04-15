import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const advertSchema = new mongoose.Schema(
  {
    // Who created the advert?
    deliveryStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Location Details
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
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
          validator: function () {
            return this.acceptedOrders.length < this.maxOrders;
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
  },
  { timestamps: true }
);

// Indexes for fast queries
// TTL Index for auto-expire
advertSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: parseInt(process.env.ADVERT_EXPIRY) }
);
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

advertSchema.pre("save", async function (next) {
  try {
    // Only trigger if status was changed to 'in_progress'
    if (this.isModified("status") && this.status === "in_progress") {
      // Update all accepted orders
      await mongoose.model("Order").updateMany(
        {
          _id: { $in: this.acceptedOrders },
          status: "accepted", // Only update accepted orders
        },
        { $set: { status: "in_progress" } }
      );
    } else if (this.isModified("status") && this.status === "cancelled") {
      // Update all cancelled orders
      await mongoose.model("Order").updateMany(
        {
          _id: { $in: this.acceptedOrders },
        },
        { $set: { status: "cancelled" } }
      );
    }
    next();
  } catch (err) {
    console.error("Error updating order statuses:", err);
    next(err);
  }
});

const Advert = mongoose.model("Advert", advertSchema);

export default Advert;
