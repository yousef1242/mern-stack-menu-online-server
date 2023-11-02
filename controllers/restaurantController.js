const asyncHandler = require("express-async-handler");
const { Restaurant } = require("../models/restaurant");
const cloudinary = require("../utils/cloudinary");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

// create restaurant
const createRestaurantController = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({
    restaurantName: req.body.restaurantName,
  });
  if (restaurant) {
    return res.status(500).json({ message: "This restaurant is exist" });
  } else {
    if (req.file) {
      const hashPassword = await bcrypt.hash(req.body.restaurantPassword, 10);
      // Upload the resized WebP image to Cloudinary
      const resultImage = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
        format: "webp", // Set the format to WebP
        transformation: {
          width: 100,
          height: 100,
          crop: "fit", // Use "fit" for resizing while maintaining the aspect ratio
          quality: "auto:best", // Set the quality to the best
        },
      });
      const newRestaurant = new Restaurant({
        ...req.body,
        restaurantImage: resultImage.secure_url,
        restaurantPassword: hashPassword,
      });
      const saveRestaurant = await newRestaurant.save();
      return res.status(200).json({
        message: "Your restaurant account has been created",
        saveRestaurant: saveRestaurant,
      });
    } else {
      return res.status(500).json({ message: "Please choose image" });
    }
  }
});

// login to restaurant
const loginToRestaurantController = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({
    restaurantEmail: req.body.email,
  });
  if (!restaurant) {
    return res.status(500).json({ message: "This restaurant doesn't exist" });
  } else {
    const comparePassword = await bcrypt.compare(
      req.body.password,
      restaurant.restaurantPassword
    );
    if (comparePassword) {
      if (
        restaurant.restaurantSubscribePlan &&
        restaurant.restaurantSubscribePlan.planName !== "" &&
        restaurant.restaurantSubscribePlan.endDate !== null
      ) {
        const token = JWT.sign(
          { id: restaurant._id },
          process.env.JWT_SECRET_KEY
        );
        return res.status(200).json({
          id: restaurant._id,
          token: token,
        });
      } else {
        return res.status(500).json({
          message: "This restaurant doesn't subscribe in any plan",
        });
      }
    } else {
      return res.status(500).json({ message: "Password doesn't match" });
    }
  }
});

// get single resaurant
const getSingleRestaurantController = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.retaurantId).select(
    "-restaurantPassword"
  );
  if (!restaurant) {
    return res.status(500).json({ message: "This restaurant doesn't exist" });
  } else {
    if (
      restaurant.restaurantSubscribePlan &&
      restaurant.restaurantSubscribePlan.planName !== "" &&
      restaurant.restaurantSubscribePlan.endDate !== null
    ) {
      res.status(200).json(restaurant);
    } else {
      return res.status(500).json({
        message: "This restaurant doesn't subscribe in any plan",
      });
    }
  }
});

// subscribe in plan
const subscribeInPlanController = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (
    !restaurant.restaurantSubscribePlan?.planName &&
    restaurant.restaurantSubscribePlan?.endDate === null
  ) {
    if (req.body.planName === "month") {
      // Get the current date
      const currentDate = new Date();

      // Increase the month by one
      currentDate.setMonth(currentDate.getMonth() + 1);

      // Get the updated date
      const updatedDate = currentDate.toDateString();
      await Restaurant.findByIdAndUpdate(req.params.restaurantId, {
        $set: {
          restaurantSubscribePlan: {
            planeName: "month",
            endDate: updatedDate,
          },
        },
      });
      return res
        .status(200)
        .json({ message: "You subscibed in month plan successfully" });
    } else if (req.body.planName === "year") {
      // Get the current date
      const currentDate = new Date();

      // Increase the month by one
      currentDate.setFullYear(currentDate.getFullYear() + 1);

      // Get the updated date
      const updatedDate = currentDate.toDateString();
      await Restaurant.findByIdAndUpdate(req.params.restaurantId, {
        $set: {
          restaurantSubscribePlan: {
            planeName: "year",
            endDate: updatedDate,
          },
        },
      });
      return res
        .status(200)
        .json({ message: "You subscibed in year plan successfully" });
    }
  } else {
    return res
      .status(500)
      .json({ message: "This restaurant already subscribed" });
  }
});

module.exports = {
  createRestaurantController,
  loginToRestaurantController,
  getSingleRestaurantController,
  subscribeInPlanController,
};
