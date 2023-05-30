"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Cart success.",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  update = async (req, res, next) => {
    new SuccessResponse({
      message: "Update Cart Item success.",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  deleteCartItem = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete Cart Item success.",
      metadata: await CartService.deleteCartItem(req.body),
    }).send(res);
  };

  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "List Cart success.",
      metadata: await CartService.getListCartItem(req.body),
    }).send(res);
  };
}

module.exports = new CartController();
