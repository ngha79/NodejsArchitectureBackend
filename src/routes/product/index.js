"use strict";
const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const productController = require("../../controllers/product.controller");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.get(
  "/search/:keySearch",
  asyncHandler(productController.searchProducts)
);

router.get("", asyncHandler(productController.findAllProducts));
router.get("/:product_id", asyncHandler(productController.findProduct));

router.use(authentication);
router.post("", asyncHandler(productController.createProduct));
router.patch("/:productId", asyncHandler(productController.updateProduct));

router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unpublishProductByShop)
);

router.get("/drafts/all", asyncHandler(productController.findAllDraftForShop));
router.get(
  "/published/all",
  asyncHandler(productController.findAllPublishForShop)
);

module.exports = router;
