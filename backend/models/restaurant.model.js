import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // Just a placeholder for now.
    dietaryTags: [
      {
        // e.g., "vegetarian", "gluten-free"
        type: String,
        enum: ["vegetarian", "vegan", "gluten-free", "halal", "spicy"],
        default: [],
      },
    ],
  },
  { _id: true }
); // Keep individual IDs for food items

const menuCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    items: [foodItemSchema], // Embedded food items
    displayOrder: {
      // For sorting categories
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    operatingHours: {
      type: Map, // Dynamic days (e.g., "monday": "9:00-22:00")
      of: String,
      default: {}, // Initialize as empty map
    },
    menu: [menuCategorySchema], // Array of categories
    //TODO: Don't really know if the imageURL is needed just leave here for now
    imageUrl: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Checks if restaurant is currently open
 * @returns {boolean} - True if open now
 */
restaurantSchema.methods.isOpenNow = function() {
  const now = moment();
  const currentDay = now.format('dddd').toLowerCase(); // e.g. "monday"
  const hoursString = this.operatingHours.get(currentDay);

  // Handle special cases
  if (!hoursString || hoursString.toLowerCase() === "closed") return false;
  if (hoursString === "24/7") return true;

  // Parse time ranges (supports multiple ranges like "11:00-14:00, 17:00-22:00")
  const timeRanges = hoursString.split(',');
  
  return timeRanges.some(range => {
    const [openStr, closeStr] = range.trim().split('-');
    
    const openTime = moment(openStr.trim(), "HH:mm");
    const closeTime = moment(closeStr.trim(), "HH:mm");
    
    // Handle overnight ranges (e.g. "22:00-03:00")
    if (closeTime.isBefore(openTime)) {
      return now.isAfter(openTime) || now.isBefore(closeTime);
    }
    
    return now.isBetween(openTime, closeTime);
  });
};

// Add validation for time format
restaurantSchema.path("operatingHours").validate(function(value) {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  
  for (const [day, hours] of value.entries()) {
    if (hours.toLowerCase() === "closed" || hours === "24/7") continue;
    
    const ranges = hours.split(',');
    for (const range of ranges) {
      const [open, close] = range.split('-');
      if (!timeRegex.test(open?.trim()) || !timeRegex.test(close?.trim())) {
        return false;
      }
    }
  }
  return true;
}, "Invalid time format. Use HH:mm (e.g. '09:00-17:00')");


const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
