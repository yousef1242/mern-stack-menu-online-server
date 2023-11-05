const {
  createProductsController,
  getAllProductsController,
  deleteProductController,
  updateProductController,
  getSingleProductController,
} = require("../controllers/productsController");
const {
  checkSubscribtion,
  checkSubscribtionEnd,
} = require("../middleware/checkSubscribe");
const { verifyToken } = require("../middleware/verifyToken");
const storage = require("../utils/multer");
const { validateObjectId } = require("../middleware/objectIdValidate");
const router = require("express").Router();

// create product
router.post(
  "/create",
  verifyToken,
  checkSubscribtion,
  checkSubscribtionEnd,
  storage.single("image"),
  createProductsController
);

// get all products for restaurant
router.get(
  "/:restaurantId",
  validateObjectId,
  getAllProductsController
);

// get single product for restaurant
router.get(
  "/:productId/:restaurantId",
  validateObjectId,
  verifyToken,
  checkSubscribtion,
  checkSubscribtionEnd,
  getSingleProductController
);

// subscribe in plan
router.delete(
  "/:productId",
  verifyToken,
  checkSubscribtion,
  checkSubscribtionEnd,
  deleteProductController
);

// get single restaurant
router.put(
  "/update/:productId",
  verifyToken,
  checkSubscribtion,
  checkSubscribtionEnd,
  storage.single("file"),
  updateProductController
);

module.exports = router;
