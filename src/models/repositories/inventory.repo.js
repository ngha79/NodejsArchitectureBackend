"use strict";

const { inventory } = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnow",
}) => {
  return await inventory.create({
    inven_shopId: shopId,
    inven_location: location,
    inven_stock: stock,
    inven_productId: productId,
  });
};

module.exports = {
  insertInventory,
};
