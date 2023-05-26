"use strict";

const { findById } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apikey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "perrmission denied",
      });
    }
    return next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch();
  };
};

module.exports = {
  apikey,
  permission,
  asyncHandler,
};
