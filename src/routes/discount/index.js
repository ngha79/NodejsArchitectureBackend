"use strict";
const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();

router.get(
  "/all-discount-product",
  asyncHandler(discountController.getAllDiscountCodesWithProduct)
);
router.get(
  "/all-discount-shop",
  asyncHandler(discountController.getAllDiscountCodesByShop)
);

router.use(authentication);

router.post("/", asyncHandler(discountController.createDiscount));
router.patch("/:discountId", asyncHandler(discountController.updateDiscount));
router.delete("/", asyncHandler(discountController.deleteDiscount));
router.patch(
  "/discount-amount",
  asyncHandler(discountController.getDiscountAmount)
);
router.patch(
  "/cancel-discount",
  asyncHandler(discountController.cancelDiscountCode)
);

module.exports = router;
