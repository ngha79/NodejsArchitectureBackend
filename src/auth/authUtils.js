"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("./checkAuth");
const { NotFoundError, AuthFailureError } = require("../core/error.response");
const KeyTokenService = require("../services/keytoken.service");

const HEADER = {
  APT_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request!");

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not Found!");

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid request!");

  try {
    const decoded = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decoded.userId)
      throw new AuthFailureError("Invalid Userid!");
    req.keyStore = keyStore;
    return netx();
  } catch (error) {
    throw error;
  }
});

module.exports = {
  createTokenPair,
  authentication,
};
