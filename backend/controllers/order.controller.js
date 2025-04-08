import Order from "../models/order.model.js";
import Advert from "../models/advert.model.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";

/**
 * @desc    Create a new food order
 * @route   POST /server/orders/createOrder
 * @access  Public
 */
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { advertId, items, customerId } = req.body;

    // Validate required fields
    if (!advertId || !items || !Array.isArray(items) || items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Advert ID and at least one menu item are required",
      });
    }

    const user = await User.findOne({ studentID: customerId });
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "User not found",
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
      customer: user._id,
      advert: advertId,
      restaurant: advert.restaurant._id,
      items: orderItems,
      deliveryFee:
        parseFloat(process.env.DELIVERY_FEE) +
        parseFloat(process.env.PROCESSING_FEE),
      totalAmount:
        subtotal +
        parseFloat(process.env.DELIVERY_FEE) +
        parseFloat(process.env.PROCESSING_FEE),
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
      message: "Order successfully placed.",
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

/**
 * @desc    Accept an order (by delivery student)
 * @route   PATCH /server/orders/:id/accept
 * @access  Public
 */
export const acceptOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { deliveryStudentID } = req.body;

    // 1. Validate order exists
    const order = await Order.findById(id).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "accepted") {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Order already accepted",
      });
    }

    // 2. Get associated advert
    const advert = await Advert.findById(order.advert)
      .populate({ path: "deliveryStudent" })
      .session(session);

    // 3. Verify the requester owns the advert
    if (advert.deliveryStudent.studentID !== deliveryStudentID) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Not authorized to accept this order",
      });
    }

    // 4. Check advert capacity
    if (advert.acceptedOrders.length >= advert.maxOrders) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Advert has reached maximum orders (${advert.maxOrders})`,
      });
    }

    // 5. Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: "accepted" },
      { new: true, session }
    );

    // 6. Save the updated order
    await updatedOrder.save();
    await session.commitTransaction();

    // 7. TODO: Trigger notification to customer here
    res.status(200).json({
      success: true,
      data: updatedOrder,
      message: "Order successfully accepted.",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Order acceptance error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to accept order",
    });
  } finally {
    session.endSession();
  }
};
