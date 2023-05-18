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

  static removeKeyById = async (keyStoreId) => {
    return await keytokenModel.remove(keyStoreId);
  };
}

module.exports = KeyTokenService;
