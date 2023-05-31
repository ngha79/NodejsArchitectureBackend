"use strict";

const { convertToObjectMongo } = require("../../utils");
const { order } = require("../oder.model");

const findOderById = async (orderId) => {
  return await order.findById(convertToObjectMongo(orderId)).lean();
};

module.exports = { findOderById };
