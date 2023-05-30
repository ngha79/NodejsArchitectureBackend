"use strict";

const { update } = require("lodash");
const { NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      option = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateOrInsert, option);
  }

  static async updateUserCartQuatity({ userId, product }) {
    const { productId, quatity } = product;

    let query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.quatity": quatity,
        },
      },
      option = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateSet, option);
  }

  static async addToCart({ userId, product = {} }) {
    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      return await CartService.createUserCart({ userId, product });
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    return await CartService.updateUserCartQuatity({ userId, product });
  }

  static async addToCartV2({ userId, shop_oder_ids }) {
    const { productId, quantity, old_quantity } =
      shop_oder_ids[0]?.item_products[0];

    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("Product not exist!");
    if (foundProduct.product_shop.toString() !== shop_oder_ids[0]?.shopId) {
      throw new NotFoundError("Product do not belong to the shop!");
    }
    if (quantity === 0) {
      ///delete cart item
      return await CartService.deleteCartItem({ userId, productId });
    }
    return await CartService.updateUserCartQuatity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteCartItem({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };

    return await cart.updateOne(query, updateSet);
  }

  static async getListCartItem({ userId }) {
    return await cart.findOne({ cart_userId: +userId }).lean();
  }
}

module.exports = CartService;
