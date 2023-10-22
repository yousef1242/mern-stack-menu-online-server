const mongoose = require("mongoose");

const restaurantShcema = new mongoose.Schema({
  restaurantName: {
    type: String,
  },
  restaurantPassword: {
    type: String,
  },
  restaurantTitle: {
    // like coffe and drinks or chicken somthing like that
    type: String,
  },
  restaurantImage: {
    type: String,
  },
  restaurantEmail: {
    type: String,
  },
  restaurantFacebookPageLink: {
    type: String,
  },
  restaurantInstagramPageLink: {
    type: String,
  },
  restaurantAdress: {
    type: String,
  },
  restaurantOpenTime: {
    type: String,
  },
  restaurantCloseTime: {
    type: String,
  },
  restaurantSubscribePlan: {
    type: Object,
    default: {
      planName: "",
      endDate: null,
    },
  },
});

const Restaurant = mongoose.model("Restaurant", restaurantShcema);

module.exports = {
  Restaurant,
};
