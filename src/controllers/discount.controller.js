"use strict";

const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscount = async (req, res, next) => {
    new SuccessResponse({
      message: "Create discount success.",
      metadata: await DiscountService.createDiscountCode(req.body),
    }).send(res);
  };

  updateDiscount = async (req, res, next) => {
    new SuccessResponse({
      message: "Update discount success.",
      metadata: await DiscountService.updateDiscount(
        req.params.discountId,
        req.body
      ),
    }).send(res);
  };

  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "getAllDiscountCodesWithProduct success.",
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.body,
      }),
    }).send(res);
  };

  getAllDiscountCodesByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "getAllDiscountCodesByShop success.",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.body,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "get Discount Amount success.",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };

  deleteDiscount = async (req, res, next) => {
    new SuccessResponse({
      message: "delete Discount success.",
      metadata: await DiscountService.deleteDiscount({ ...req.body }),
    }).send(res);
  };

  cancelDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "cancel Discount success.",
      metadata: await DiscountService.cancelDiscountCode({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
