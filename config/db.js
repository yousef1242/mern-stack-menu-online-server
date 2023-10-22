const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECT_DB);
    console.log("Connect DB");
  } catch (error) {
    console.log("Faild connect DB", error);
  }
};

module.exports = {connectDB};
