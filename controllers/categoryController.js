const asyncHandler = require("express-async-handler");
const { Categories } = require("../models/category");
const { Restaurant } = require("../models/restaurant");

// create category
const createCategoryController = asyncHandler(async (req, res) => {
  const existCategory = {};
  if (req.body.restaurantId) {
    existCategory.restaurantId = req.body.restaurantId
  }
  if (req.body.title) {
    existCategory.title = req.body.title
  }
  const category = await Categories.findOne(existCategory);
  if (category) {
    return res.status(500).json({ message: "This category is exist" });
  }
  const newCategory = new Categories({
    title: req.body.title,
    restaurantId: req.body.restaurantId,
  });
  const saveCategory = await newCategory.save();
  res
    .status(200)
    .json({ message: "Category has been created", saveCategory: saveCategory });
});

// delete category
const deleteCategoryController = asyncHandler(async (req, res) => {
  const category = await Categories.findById(req.params.categoryId);
  if (!category) {
    return res.status(500).json({ message: "This category isn't exist" });
  }
  await Categories.findByIdAndDelete(req.params.categoryId);
  res.status(200).json({ message: "Category has been deleted" });
});

// get categories for restaurant
const getCategoriesForRestaurantController = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant) {
    return res.status(500).json({ message: "This restauranr isn't exist" });
  }
  const categoriesRestaurant = await Categories.find({
    restaurantId: req.params.restaurantId,
  }).sort({ createdAt: -1 });
  res.status(200).json(categoriesRestaurant);
});

module.exports = {
  createCategoryController,
  deleteCategoryController,
  getCategoriesForRestaurantController,
};
