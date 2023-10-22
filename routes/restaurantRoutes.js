const {
  createRestaurantController,
  loginToRestaurantController,
  subscribeInPlanController,
  getSingleRestaurantController,
} = require("../controllers/restaurantController");
const storage = require("../utils/multer")

const router = require("express").Router();

// create restaurant
router.post("/create", storage.single("image"), createRestaurantController);

// login to restaurant
router.post("/login", loginToRestaurantController);

// subscribe in plan
router.put("/subscribe/:restaurantId", subscribeInPlanController);

// get single restaurant
router.get("/single/:retaurantId", getSingleRestaurantController);

module.exports = router;
