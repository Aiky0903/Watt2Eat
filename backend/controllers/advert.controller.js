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
    const deliveryStudent = req.user;
    const { restaurant, departureTime, estimatedReturnTime, maxOrders } =
      req.body;

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

    const validUser = await User.findById(deliveryStudent._id);
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
      message: "Advert successfully created.",
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

/**
 * @desc    Complete an advert (by Delivery Student)
 * @route   PATCH /server/adverts/:id/complete
 * @access  Public
 */
export const completeAdvert = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const deliveryStudent = req.user; // From auth middlware

    // 1. Validate advert exists
    const advert = await Advert.findById(id)
      .populate({ path: "deliveryStudent" })
      .session(session);

    if (!advert) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Advert not found",
      });
    }

    // 2. Validate advert is not already completed
    if (advert.status === "complete") {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Advert already completed",
      });
    }

    // 3. Verify the requester owns the advert
    if (advert.deliveryStudent.studentID !== deliveryStudent.studentID) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Not authorized to accept this order",
      });
    }

    // 5. Update advert status
    advert.status = "completed";

    // 6. Save the updated order
    await advert.save();
    await session.commitTransaction();

    // 7. TODO: Trigger notification to customer here
    res.status(200).json({
      success: true,
      data: advert,
      message: "Advert successfully completed.",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Advert completion error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to complete advert.",
    });
  } finally {
    session.endSession();
  }
};

/**
 * @desc    Cancel an advert (by Delivery Student)
 * @route   PATCH /server/adverts/:id/cancel
 * @access  Public
 */
export const cancelAdvert = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const deliveryStudent = req.user; // From auth middlware

    // 1. Validate advert exists
    const advert = await Advert.findById(id)
      .populate({ path: "deliveryStudent" })
      .session(session);

    if (!advert) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Advert not found",
      });
    }

    // 2. Validate advert is not already cancelled
    if (advert.status === "cancelled") {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Advert already cancelled",
      });
    }

    // 3. Verify the requester owns the advert
    if (advert.deliveryStudent.studentID !== deliveryStudent.studentID) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    // 5. Update advert status
    advert.status = "cancelled";

    // 6. Save the updated order
    await advert.save({ session });
    await session.commitTransaction();

    // 7. TODO: Trigger notification to customer here
    res.status(200).json({
      success: true,
      data: advert,
      message: "Advert successfully cancelled.",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Advert cancellation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel advert.",
    });
  } finally {
    session.endSession();
  }
};

/**
 * @desc    Progress an advert (by Delivery Student)
 * @route   PATCH /server/adverts/:id/progress
 * @access  Public
 */
export const progressAdvert = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const deliveryStudent = req.user; // From auth middlware

    // 1. Validate advert exists
    const advert = await Advert.findById(id)
      .populate({ path: "deliveryStudent" })
      .session(session);

    if (!advert) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Advert not found",
      });
    }

    // 2. Validate advert is not already in progress
    if (advert.status === "in_progress") {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Advert already in progress.",
      });
    }

    // 3. Verify the requester owns the advert
    if (advert.deliveryStudent.studentID !== deliveryStudent.studentID) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this order",
      });
    }

    // 5. Update advert status
    advert.status = "in_progress";

    // 6. Save the updated order
    await advert.save({ session });
    await session.commitTransaction();

    // 7. TODO: Trigger notification to customer here
    res.status(200).json({
      success: true,
      data: advert,
      message: "Advert successfully updated.",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Advert progression error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update advert.",
    });
  } finally {
    session.endSession();
  }
};

/**
 * @desc    Get all active adverts
 * @route   GET /server/adverts/getActiveAdverts
 * @access  Public
 */
export const getActiveAdverts = async (req, res) => {
  try {
    const adverts = await Advert.find({ status: "active" }).populate({
      path: 'restaurant',
      select: 'name -_id',
    });
    res.status(201).json({ success: true, data: adverts });
  } catch (error) {
    console.log("Error is fetching all adverts ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdvert = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const deliveryStudent = req.user; // From auth middlware

    // 1. Validate advert exists
    const advert = await Advert.findById(id)
      .populate({ path: "deliveryStudent" })
      .session(session);

    if (!advert) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Advert not found",
      });
    }

    // 2. Verify the requester owns the advert
    if (advert.deliveryStudent.studentID !== deliveryStudent.studentID) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this order",
      });
    }

    // 3. Delete to order
    await advert.deleteOne({ session });
    await session.commitTransaction();

    // 4. TODO: Trigger notification to customer here
    res.status(200).json({
      success: true,
      message: "Advert successfully deleted.",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Advert deletion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete advert.",
    });
  } finally {
    session.endSession();
  }
};
