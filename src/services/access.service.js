"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keytoken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getIntoData } = require("../utils");
const {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITER: "EDITER",
  ADMIN: "ADMIN",
};

class AccessService {
  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findRefreshTokenUsed(refreshToken);
    if (foundToken) {
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );

      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happen !! Please relogin.");
    }

    const holderToken = await KeyTokenService.findRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("Shop not registered!");

    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered!");

    const tokens = await KeyTokenService.createKeyToken(
      {
        userId,
        email,
      },
      holderToken.privateKey,
      holderToken.publicKey
    );

    await holderToken.update({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async (keyStore) => {
    return await KeyTokenService.removeKeyById(keyStore._id);
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await shopModel.findOne({ email }).lean();
    if (!foundShop) throw new BadRequestError("Shop not registered!");

    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication error!");
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getIntoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        throw new ConflictRequestError(
          "Forbidden:: Shop already regsitered!",
          403
        );
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        password: hashPassword,
        email,
        roles: [RoleShop.SHOP],
      });
      if (newShop) {
        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
          refreshToken: tokens.refreshToken,
        });

        if (!keyStore) {
          throw new ConflictRequestError(
            "Forbidden:: Shop already regsitered!",
            403
          );
        }

        return {
          code: 201,
          metadata: {
            shop: getIntoData({
              fields: ["_id", "email", "name"],
              object: newShop,
            }),
            tokens,
          },
        };
      }
      return {
        code: 200,
        message: "Error",
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
