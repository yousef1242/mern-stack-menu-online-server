const {
  createRestaurantController,
  loginToRestaurantController,
  subscribeInPlanController,
  getSingleRestaurantController,
  checkEmailExistWhenRestaurantSubscribeController,
} = require("../controllers/restaurantController");
const { validateObjectId } = require("../middleware/objectIdValidate");
const storage = require("../utils/multer");

const router = require("express").Router();

// get single restaurant
router.get(
  "/single/:restaurantId",
  validateObjectId,
  getSingleRestaurantController
);

// create restaurant
router.post("/create", storage.single("image"), createRestaurantController);

// login to restaurant
router.post("/login", loginToRestaurantController);

// subscribe in plan
router.put("/subscribe", subscribeInPlanController);

// check email exist when restaurant sebscribe
router.post(
  "/check-email-subscribe",
  checkEmailExistWhenRestaurantSubscribeController
);

module.exports = router;
