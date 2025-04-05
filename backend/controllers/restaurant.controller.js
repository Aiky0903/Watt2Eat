import Restaurant from "../models/restaurant.model.js";
import mongoose from "mongoose";
import moment from "moment";

/**
 * @desc    Create a new restaurant
 * @route   POST /server/restaurants/createRestaurant
 * @access  Private/Admin
 */
export const createRestaurant = async (req, res, next) => {
  try {
    const { name, operatingHours, menu, imageUrl } = req.body;

    // Basic validation
    if (!name || !operatingHours || !menu) {
      return res.status(400).json({
        success: false,
        message: "Name, operating hours, and menu are required",
      });
    }

    // Create restaurant object
    const newRestaurant = new Restaurant({
      name,
      operatingHours: new Map(Object.entries(operatingHours)), // Convert object to Map
      menu: menu.map((category) => ({
        ...category,
        items: category.items.map((item) => ({
          ...item,
          price: Number(item.price.toFixed(2)), // Ensure proper decimal format
        })),
      })),
      imageUrl: imageUrl || "",
    });

    // Validate operating hours format
    const validationError = newRestaurant.validateSync();
    if (validationError) {
      const errors = Object.values(validationError.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Save to database
    const savedRestaurant = await newRestaurant.save();

    res.status(201).json({
      success: true,
      data: savedRestaurant,
    });
  } catch (error) {
    // Handle duplicate name error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Restaurant with this name already exists",
      });
    }
    next(error);
  }
};