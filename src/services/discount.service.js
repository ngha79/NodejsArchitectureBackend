"use strict";

const { max } = require("lodash");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const {
  findAllDiscountCodesSelect,
  findAllDiscountCodesUnSelect,
  updateDiscountById,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToObjectMongo } = require("../utils");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_oder_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date))
      throw new BadRequestError("Discount code has expired!");

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must before end date!");
    }

    const foundCode = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectMongo(shopId),
      })
      .lean();

    if (foundCode && foundCode.discount_isActive) {
      throw new BadRequestError("Discount exist!");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_code: code,
      discount_type: type,
      discount_value: value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_max_value: max_value,
      discount_uses_count: uses_count,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_oder_value: min_oder_value,
      discount_shopId: shopId,
      discount_isActive: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: product_ids === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscount(discountId, bodyUpdate) {
    return await updateDiscountById({
      discountId,
      bodyUpdate,
      model: discount,
    });
  }

  /*
    Get all discount code with product
    */

  static async getAllDiscountCodesWithProduct({ code, shopId, limit, page }) {
    const foundCode = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectMongo(shopId),
      })
      .lean();

    if (!foundCode || !foundCode.discount_isActive) {
      throw new NotFoundError("Discount not exist!");
    }

    const { discount_applies_to, discount_product_ids } = foundCode;

    let products;

    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectMongo(shopId),
          isPublish: true,
        },
        limit: +limit,
        page: +page,
        select: ["product_name"],
        sort: "ctime",
      });
    }

    if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: [discount_product_ids] },
          isPublish: true,
        },
        limit: +limit,
        page: +page,
        select: ["product_name"],
        sort: "ctime",
      });
    }

    return products;
  }

  /**
   * Get all discount code of shop
   */
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectMongo(shopId),
        discount_isActive: true,
      },
      select: ["discount_code", "discount_name"],
      model: discount,
    });

    return discounts;
  }

  static async getDiscountAmount({ codeId, shopId, userId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectMongo(shopId),
      },
    });

    if (!foundDiscount) throw new BadRequestError("Discount not exist!");
    const {
      discount_isActive,
      discount_max_uses,
      discount_min_oder_value,
      discount_start_date,
      discount_end_date,
      discount_users_used,
      discount_type,
    } = foundDiscount;

    if (!discount_isActive) throw new BadRequestError("Discount expired!");
    if (!discount_max_uses) throw new BadRequestError("Discount are out!");

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError("Discount ecode has expired!");
    }

    let totalOder = 0;
    if (discount_min_oder_value > 0) {
      totalOder = products.reduce((acc, product) => {
        return acc + product.quatity * product.price;
      }, 0);

      if (totalOder < discount_min_oder_value) {
        throw new BadRequestError(
          `Discount requries a minium oder value of ${discount_min_oder_value}`
        );
      }
    }

    if (discount_max_uses > 0) {
      const userUseDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );

      if (userUseDiscount) {
        throw new BadRequestError("Discount used!");
      }
    }

    const amount =
      discount_type === "fix_amount"
        ? discount_value
        : totalOder * (discount_value / 100);

    return {
      totalOder,
      discount: amount,
      totalPrice: totalOder - amount,
    };
  }

  static async deleteDiscount({ codeId, shopId }) {
    return await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectMongo(shopId),
    });
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectMongo(shopId),
      },
    });

    if (!foundDiscount) throw new BadRequestError(`Discount doesn't exist!`);

    return await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });
  }
}

module.exports = DiscountService;
