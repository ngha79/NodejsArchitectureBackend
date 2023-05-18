"use strict";
const express = require("express");
const { apikey, permission } = require("../auth/checkAuth");
const router = express.Router();

router.use(apikey);
router.use(permission("0000"));

router.use("/v1/api", require("./access"));

module.exports = router;
