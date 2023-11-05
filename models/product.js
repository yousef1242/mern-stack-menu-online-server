const mongoose = require("mongoose");

const productsShcema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  name: {
    type: String,
    required: true,
  },
  sizes: {
    type: [
      {
        size: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    ],
    default: [],
  },
  ingredients: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: Object,
    default: {
      url: "",
      publicId: null,
    },
  },
  isAvilable: {
    type: Boolean,
    default: true,
  },
});

const Products = mongoose.model("Products", productsShcema);

module.exports = {
  Products,
};
