const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  title: {
    type: String,
    required: true,
  },
});

const Categories = mongoose.model("Category", categorySchema);

module.exports = {
  Categories,
};
