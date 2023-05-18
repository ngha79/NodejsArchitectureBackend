"use strict";

const apikeyModel = require("../models/apikey.model");
const crypto = require("crypto");

const findById = async (key) => {
  //   await apikeyModel.create({
  //     key: crypto.randomBytes(64).toString("hex"),
  //     permissions: ["0000"],
  //   });
  const api = await apikeyModel.findOne({ key, status: true }).lean();
  return api;
};

module.exports = {
  findById,
};
