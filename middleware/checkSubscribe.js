const { Restaurant } = require("../models/restaurant");

// check if restaurant subscribe
const checkSubscribtion = async (req, res, next) => {
  if (!req.restaurant) {
    return res.status(401).json({ message: "Restaurant id is missing" });
  }

  const restaurantId = req.restaurant.id;

  if (restaurantId) {
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant) {
      if (
        !restaurant.restaurantSubscribePlan?.planName &&
        restaurant.restaurantSubscribePlan?.endDate === null
      ) {
        return res.status(401).json({
          message: "This restaurant doesn't subscribe to any plan",
        });
      } else {
        next();
      }
    } else {
      return res.status(401).json({ message: "Restaurant doesn't exist" });
    }
  } else {
    return res.status(401).json({ message: "Something went wrong" });
  }
};

// check if restaurant subscribe end
const checkSubscribtionEnd = async (req, res, next) => {
  if (!req.restaurant) {
    return res.status(401).json({ message: "Restaurant id is missing" });
  }

  const restaurantId = req.restaurant.id;

  if (restaurantId) {
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant) {
      // Check if the subscription plan exists and has an end date
      if (
        !restaurant.restaurantSubscribePlan?.planName &&
        restaurant.restaurantSubscribePlan?.endDate === null
      ) {
        return res.status(401).json({
          message: "This restaurant doesn't subscribe to any plan",
        });
      } else {
        const currentDate = new Date();
        const endDate = new Date(restaurant.restaurantSubscribePlan.endDate);

        // Compare the current date with the end date
        if (currentDate > endDate) {
          // If the current date is greater, set the subscription plan to null
          restaurant.restaurantSubscribePlan = {
            planName: "",
            endDate: null,
          };
          await restaurant.save();
          return res
            .status(401)
            .json({ message: "Your subscription has ended" });
        } else {
          next();
        }
      }
    } else {
      return res.status(401).json({ message: "Restaurant doesn't exist" });
    }
  } else {
    return res.status(401).json({ message: "Something went wrong" });
  }
};

module.exports = {
  checkSubscribtion,
  checkSubscribtionEnd,
};
