const asyncHandler = require("express-async-handler");
const { Restaurant } = require("../models/restaurant");
const cloudinary = require("../utils/cloudinary");
const { Products } = require("../models/product");

// create product
const createProductsController = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.restaurant.id);
  if (!restaurant) {
    return res.status(500).json({ message: "This restaurant is exist" });
  } else {
    if (
      !restaurant.restaurantSubscribePlan?.planName &&
      restaurant.restaurantSubscribePlan?.endDate === null
    ) {
      return res.status(400).json({
        message: "This restaurant doesn't subscribe in any plan",
      });
    } else {
      if (req.file) {
        // Upload the resized WebP image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "image",
          format: "webp", // Set the format to WebP
          transformation : {
            width : 300,
            height : 300,
            crop : "fill",
          }
        });

        const newProduct = new Products({
          ...req.body,
          image: result.secure_url,
        });
        if (req.body.size && req.body.price) {
          const { size, price } = req.body;

          for (let i = 0; i < size.length && i < price.length; i++) {
            newProduct.sizes.push({
              size: size[i],
              price: price[i],
            });
          }
        }
        await newProduct.save();
        return res.status(200).json({ message: "Product has been created" });
      } else {
        return res.status(400).json({ message: "Please choose image" });
      }
    }
  }
});

// get all products for restaurant
const getAllProductsController = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant) {
    return res.status(400).json({ message: "This restaurant isn't exist" });
  } else {
    if (
      !restaurant.restaurantSubscribePlan?.planName &&
      restaurant.restaurantSubscribePlan?.endDate === null
    ) {
      return res.status(500).json({
        message: "This restaurant doesn't subscribe in any plan",
      });
    } else {
      const filter = { restaurantId: req.params.restaurantId };
      if (req.query.category !== "undefined") {
        filter.category = req.query.category;
        filter.restaurantId = req.params.restaurantId;
      } else {
        filter.restaurantId = req.params.restaurantId;
      }
      const products = await Products.find(filter);
      return res.status(200).json(products);
    }
  }
});

// get all products for restaurant
const getSingleProductController = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant) {
    return res.status(500).json({ message: "This restaurant isn't exist" });
  } else {
    if (
      !restaurant.restaurantSubscribePlan?.planName &&
      restaurant.restaurantSubscribePlan?.endDate === null
    ) {
      return res.status(500).json({
        message: "This restaurant doesn't subscribe in any plan",
      });
    } else {
      const products = await Products.findById(req.params.productId);
      return res.status(200).json(products);
    }
  }
});

// delete product
const deleteProductController = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.restaurant.id);
  if (!restaurant) {
    return res.status(500).json({ message: "This restaurant doesn't exist" });
  } else {
    const product = await Products.findById(req.params.productId);
    if (!product) {
      return res.status(500).json({ message: "This product doesn't exist" });
    } else {
      if (
        !restaurant.restaurantSubscribePlan?.planName &&
        restaurant.restaurantSubscribePlan?.endDate === null
      ) {
        return res.status(500).json({
          message: "This restaurant doesn't subscribe in any plan",
        });
      } else {
        await Products.findByIdAndDelete(req.params.productId);
        return res.status(200).json({ message: "Product has been deleted" });
      }
    }
  }
});

// update product
const updateProductController = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.restaurant.id);
  if (!restaurant) {
    return res.status(500).json({ message: "This restaurant is exist" });
  } else {
    if (
      !restaurant.restaurantSubscribePlan?.planName &&
      restaurant.restaurantSubscribePlan?.endDate === null
    ) {
      return res.status(500).json({
        message: "This restaurant doesn't subscribe to any plan",
      });
    } else {
      const updateData = {
        ...req.body,
      };

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "image",
        });
        updateData.image = result.secure_url;
      }

      if (req.body.size && req.body.price) {
        const { size, price } = req.body;

        const sizes = [];

        for (let i = 0; i < size.length && i < price.length; i++) {
          sizes.push({
            size: size[i],
            price: price[i],
          });
        }

        updateData.sizes = sizes;
      }

      const updatedProduct = await Products.findByIdAndUpdate(
        req.params.productId,
        {
          $set: updateData,
        },
        { new: true } // This ensures that you get the updated product document
      );

      await updatedProduct.save();

      res.status(200).json({ message: "Product has been updated" });
    }
  }
});

module.exports = {
  createProductsController,
  getAllProductsController,
  getSingleProductController,
  deleteProductController,
  updateProductController,
};
