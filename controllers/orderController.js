const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const { Order } = require("../models/order");
const { Restaurant } = require("../models/restaurant");

// create order
const createOrderController = asyncHandler(async (req, res) => {
  const neworder = new Order({
    ...req.body,
  });
  neworder.orderNumber = crypto.randomBytes(5).toString("hex");

  if (
    req.body.productIds &&
    req.body.quantatys &&
    req.body.sizes &&
    req.body.prices
  ) {
    const { productIds, quantatys, sizes, prices } = req.body;

    for (
      let i = 0;
      i < productIds.length &&
      i < quantatys.length &&
      i < sizes.length &&
      i < prices.length;
      i++
    ) {
      neworder.products.push({
        productId: productIds[i],
        quantaty: quantatys[i],
        size: sizes[i],
        price: prices[i],
      });
    }
  } else {
    return;
  }

  const saveOrder = await neworder.save();
  res
    .status(200)
    .json({ message: "Order has completed", saveOrder: saveOrder });
});

// get all orders for restaurant
const getAllOrdersForRestaurantController = asyncHandler(async (req, res) => {
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
      const filter = { restaurantId: req.params.restaurantId };
      if (req.query.prepared === "notPrepared") {
        filter.isPrepared = false;
        filter.isPaid = true;
        filter.restaurantId = req.params.restaurantId;
      } else if (req.query.paid === "notPaid") {
        filter.isPaid = false;
        filter.restaurantId = req.params.restaurantId;
      } else {
        filter.restaurantId = req.params.restaurantId;
      }
      const orders = await Order.find(filter).populate({
        path: "products",
        populate: "productId",
      });
      return res.status(200).json(orders);
    }
  }
});

// update order status for restaurant
const updateOrderStatusForRestaurantController = asyncHandler(
  async (req, res) => {
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
        if (req.body.updateOption === "prepared") {
          await Order.findByIdAndUpdate(
            req.body.orderId,
            {
              $set: {
                isPrepared: true,
              },
            },
            {
              new: true,
            }
          );
        } else if (req.body.updateOption === "paid") {
          await Order.findByIdAndUpdate(
            req.body.orderId,
            {
              $set: {
                isPaid: true,
              },
            },
            {
              new: true,
            }
          );
        }
        return res.status(200).json({ message: "Order done" });
      }
    }
  }
);

module.exports = {
  createOrderController,
  getAllOrdersForRestaurantController,
  updateOrderStatusForRestaurantController,
};
