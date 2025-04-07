import Order from "../models/order.model.js";
import Advert from "../models/advert.model.js";
import mongoose from "mongoose";

/**
 * @desc    Create a new food order
 * @route   POST /server/orders/creatOrder
 * @access  Public
 */
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { advertId, items, specialRequests } = req.body;
    const customerId = req.studentID; // From auth middleware

    // Validate required fields
    if (!advertId || !items || !Array.isArray(items) || items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Advert ID and at least one menu item are required",
      });
    }

    // Fetch advert with restaurant data
    const advert = await Advert.findById(advertId)
      .populate({
        path: "restaurant",
        select: "menu",
      })
      .session(session);

    if (!advert) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Advert not found",
      });
    }

    // Verify advert can accept orders
    if (advert.acceptedOrders.length >= advert.maxOrders) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `This delivery slot is full (max ${advert.maxOrders} orders)`,
      });
    }

    // Process each ordered item
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      // Find the menu item in the restaurant's menu
      let menuItem = null;
      for (const category of advert.restaurant.menu) {
        menuItem = category.items.find((i) => i._id.equals(item.menuItemId));
        if (menuItem) break;
      }

      if (!menuItem) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: `Menu item ${item.menuItemId} not found`,
        });
      }

      if (!menuItem.isAvailable) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `${menuItem.name} is currently unavailable`,
        });
      }

      orderItems.push({
        item: menuItem._id,
        name: menuItem.name, // Denormalized for display
        quantity: item.quantity,
        priceAtOrder: menuItem.price, // Critical snapshot
        specialInstructions: item.specialInstructions,
      });

      subtotal += menuItem.price * item.quantity;
    }

    // Create the order
    const order = new Order({
      customer: customerId,
      advert: advertId,
      restaurant: advert.restaurant._id,
      items: orderItems,
      subtotal,
      deliveryFee: advert.deliveryFee || 0,
      totalAmount: subtotal + (advert.deliveryFee || 0),
      specialRequests,
    });

    // Validate before saving
    const validationError = order.validateSync();
    if (validationError) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(validationError.errors).map((err) => err.message),
      });
    }

    // Save order and update advert
    await order.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Order creation error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate order detected",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    session.endSession();
  }
};