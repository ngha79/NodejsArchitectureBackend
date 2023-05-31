"use strict";
const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const checkoutController = require("../../controllers/checkout.controller");
const router = express.Router();

router.post("", asyncHandler(checkoutController.checkoutReview));

module.exports = router;
