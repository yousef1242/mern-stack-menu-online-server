const {
  createCategoryController,
  deleteCategoryController,
  getCategoriesForRestaurantController,
} = require("../controllers/categoryController");
const { checkSubscribtion, checkSubscribtionEnd } = require("../middleware/checkSubscribe");
const { validateObjectId } = require("../middleware/objectIdValidate");
const { verifyToken } = require("../middleware/verifyToken");

const router = require("express").Router();

// create category
router.post(
  "/create",
  verifyToken,
  checkSubscribtion,
  checkSubscribtionEnd,
  createCategoryController
);

// delete category
router.delete(
  "/:categoryId",
  verifyToken,
  checkSubscribtion,
  checkSubscribtionEnd,
  deleteCategoryController
);

// get categories for restaurant
router.get("/:restaurantId", validateObjectId, getCategoriesForRestaurantController);

module.exports = router;
