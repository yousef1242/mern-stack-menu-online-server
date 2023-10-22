const mongoose = require("mongoose");

const orderShcema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
        },
        quantaty: {
          type: Number,
        },
        size: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    ],
    tableNumber: {
      type: String,
    },
    orderNumber: {
      type: String,
    },
    notes: {
      type: String,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    isPrepared: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderShcema);

module.exports = {
  Order,
};
