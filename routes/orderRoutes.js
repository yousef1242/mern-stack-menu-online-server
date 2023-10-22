const router = require("express").Router();
const { verifyToken } = require("../middleware/verifyToken");
const {
  getAllOrdersForRestaurantController,
  createOrderController,
  updateOrderStatusForRestaurantController,
} = require("../controllers/orderController");
const {
  checkSubscribtion,
  checkSubscribtionEnd,
} = require("../middleware/checkSubscribe");

// create order for restaurant
router.post("/create", createOrderController);

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
