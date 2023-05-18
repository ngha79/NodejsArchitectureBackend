"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.get("/shop/signup", asyncHandler(accessController.signUp));
router.get("/shop/login", asyncHandler(accessController.login));

router.use(authentication);
router.get("/shop/logout", asyncHandler(accessController.logout));

module.exports = router;
