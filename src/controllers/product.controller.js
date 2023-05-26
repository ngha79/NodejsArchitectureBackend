"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const { ProductFactory } = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get token success.",
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update product success.",
      metadata: await ProductFactory.updateProduct(
        req.body.product_type,
        req.params.producId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  findAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Find all draft for shop success.",
      metadata: await ProductFactory.findAllDraftForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  findAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Find all publish for shop success.",
      metadata: await ProductFactory.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Update publish for shop success.",
      metadata: await ProductFactory.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  unpublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Update unpublish for shop success.",
      metadata: await ProductFactory.unpublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  searchProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Search products success.",
      metadata: await ProductFactory.searchProducts(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "List findAllProducts success.",
      metadata: await ProductFactory.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "List findProduct success.",
      metadata: await ProductFactory.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
