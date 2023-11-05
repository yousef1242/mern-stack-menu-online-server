const mongoose = require("mongoose");

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.restaurantId)) {
    return res.status(400).json({ message: "invalid id" });
  }
  next();
};
module.exports = {
  validateObjectId,
};
