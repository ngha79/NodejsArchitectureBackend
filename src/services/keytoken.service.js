"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    privateKey,
    publicKey,
    refreshToken,
  }) => {
    try {
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   privateKey,
      //   publicKey,
      // });
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      console.log(update);
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: userId }).lean();
  };

  static findRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel
      .findOne({ refreshTokenUsed: refreshToken })
      .lean();
  };

  static findRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken: refreshToken }).lean();
  };

  static removeKeyById = async (keyStoreId) => {
    return await keytokenModel.remove(keyStoreId);
  };

  static deleteKeyById = async (userId) => {
    return await keytokenModel.findOneAndDelete({ user: userId });
  };
}

module.exports = KeyTokenService;
