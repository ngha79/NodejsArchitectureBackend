"use strict";

const { Types } = require("mongoose");
const { product } = require("../product.model");
const { getSelectData, unGetSelectData } = require("../../utils");

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, { new: isNew });
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return results;
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublish = true;
  const { modifiedCount } = await foundShop.save(foundShop);
  return modifiedCount;
};

const unpublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;
  foundShop.isDraft = true;
  foundShop.isPublish = false;
  const { modifiedCount } = await foundShop.save(foundShop);
  return modifiedCount;
};

const findAllProducts = async ({ page, limit, filter, select, sort }) => {
  const skip = limit * page;
  const sortType = sort === "ctime" ? { _id: 1 } : { _id: -1 };
  return await product
    .find(filter)
    .sort(sortType)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
};

const findProduct = async ({ product_id, unSelect }) => {
  return await product
    .findById(product_id)
    .select(unGetSelectData(unSelect))
    .lean();
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

module.exports = {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unpublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
};
