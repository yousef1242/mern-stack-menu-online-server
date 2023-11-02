const router = require("express").Router();
const { verifyToken } = require("../middleware/verifyToken");
const {
  getAllOrdersForRestaurantController,
  updateOrderStatusForRestaurantController,
} = require("../controllers/orderController");
const {
  checkSubscribtion,
  checkSubscribtionEnd,
} = require("../middleware/checkSubscribe");

// get all orders for restaurant
router.get(
  "/:restaurantId",
  verifyToken,
  checkSubscribtion,
  checkSubscribtionEnd,
  getAllOrdersForRestaurantController
);

// update order status for restaurant
router.put(
  "/update/:restaurantId",
  verifyToken,
  checkSubscribtion,
  checkSubscribtionEnd,
  updateOrderStatusForRestaurantController
);

module.exports = router;
