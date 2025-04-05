import Advert from "../models/advert.model.js";
import mongoose from "mongoose";
import Restaurant from "../models/restaurant.model.js";
import User from "../models/user.model.js";

/**
 * @desc    Create a new advert
 * @route   POST /server/adverts/createAdvert
 * @access  Public
 */
export const createAdvert = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      deliveryStudent,
      restaurant,
      departureTime,
      estimatedReturnTime,
      maxOrders,
    } = req.body;

    // Validate required fields
    if (
      !deliveryStudent ||
      !restaurant ||
      !departureTime ||
      !estimatedReturnTime
    ) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: deliveryStudent, restaurant.name, departureTime, estimatedReturnTime",
      });
    }

    // Validate departure is in future
    if (new Date(departureTime) < new Date()) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Departure time must be in the future",
      });
    }

    const validUser = await User.findOne({ studentID: deliveryStudent });
    if (!validUser) {
      return res.status(401).json({
        success: false,
        message: "Delivery studentID not found.",
      });
    }

    const validRestaurant = await Restaurant.findOne({ name: restaurant });
    if (!validRestaurant) {
      return res.status(401).json({
        success: false,
        message: `Restaurant not found`,
      });
    }

    // Create advert with TTL (3 days)
    const newAdvert = new Advert({
      deliveryStudent: validUser._id,
      restaurant: validRestaurant._id,
      departureTime: new Date(departureTime),
      estimatedReturnTime: new Date(estimatedReturnTime),
      maxOrders: Math.min(Number(maxOrders) || 1, 3), // Enforce max 3 orders
      status: "active",
    });

    // Validate schema
    const validationError = newAdvert.validateSync();
    if (validationError) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(validationError.errors).map((err) => err.message),
      });
    }

    // Save with transaction
    await newAdvert.save({ session });
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      data: newAdvert,
    });
  } catch (error) {
    await session.abortTransaction();

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate advert detected",
      });
    }

    console.error("Error creating advert:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    session.endSession();
  }
};
