"use strict";

const MESSAGE = {
  ACCEPTED: "Accepted",

  BAD_GATEWAY: "Bad Gateway",

  BAD_REQUEST: "Bad Request",

  CONFLICT: "Conflict",

  CONTINUE: "Continue",

  CREATED: "Created",

  EXPECTATION_FAILED: "Expectation Failed",

  FAILED_DEPENDENCY: "Failed Dependency",

  FORBIDDEN: "Forbidden",

  GATEWAY_TIMEOUT: "Gateway Timeout",

  GONE: "Gone",

  HTTP_VERSION_NOT_SUPPORTED: "HTTP Version Not Supported",

  IM_A_TEAPOT: "I'm a teapot",

  INSUFFICIENT_SPACE_ON_RESOURCE: "Insufficient Space on Resource",

  INSUFFICIENT_STORAGE: "Insufficient Storage",

  INTERNAL_SERVER_ERROR: "Internal Server Error",

  LENGTH_REQUIRED: "Length Required",

  LOCKED: "Locked",

  METHOD_FAILURE: "Method Failure",

  METHOD_NOT_ALLOWED: "Method Not Allowed",

  MOVED_PERMANENTLY: "Moved Permanently",

  MOVED_TEMPORARILY: "Moved Temporarily",

  MULTI_STATUS: "Multi-Status",

  MULTIPLE_CHOICES: "Multiple Choices",

  NETWORK_AUTHENTICATION_REQUIRED: "Network Authentication Required",

  NO_CONTENT: "No Content",

  NON_AUTHORITATIVE_INFORMATION: "Non Authoritative Information",

  NOT_ACCEPTABLE: "Not Acceptable",

  NOT_FOUND: "Not Found",

  NOT_IMPLEMENTED: "Not Implemented",

  NOT_MODIFIED: "Not Modified",

  OK: "OK",

  PARTIAL_CONTENT: "Partial Content",

  PAYMENT_REQUIRED: "Payment Required",

  PERMANENT_REDIRECT: "Permanent Redirect",

  PRECONDITION_FAILED: "Precondition Failed",

  PRECONDITION_REQUIRED: "Precondition Required",

  PROCESSING: "Processing",

  PROXY_AUTHENTICATION_REQUIRED: "Proxy Authentication Required",

  REQUEST_HEADER_FIELDS_TOO_LARGE: "Request Header Fields Too Large",

  REQUEST_TIMEOUT: "Request Timeout",

  REQUEST_TOO_LONG: "Request Entity Too Large",

  REQUEST_URI_TOO_LONG: "Request-URI Too Long",

  REQUESTED_RANGE_NOT_SATISFIABLE: "Requested Range Not Satisfiable",

  RESET_CONTENT: "Reset Content",

  SEE_OTHER: "See Other",

  SERVICE_UNAVAILABLE: "Service Unavailable",

  SWITCHING_PROTOCOLS: "Switching Protocols",

  TEMPORARY_REDIRECT: "Temporary Redirect",

  TOO_MANY_REQUESTS: "Too Many Requests",

  UNAUTHORIZED: "Unauthorized",

  UNAVAILABLE_FOR_LEGAL_REASONS: "Unavailable For Legal Reasons",

  UNPROCESSABLE_ENTITY: "Unprocessable Entity",

  UNSUPPORTED_MEDIA_TYPE: "Unsupported Media Type",

  USE_PROXY: "Use Proxy",

  MISDIRECTED_REQUEST: "Misdirected Request",
};

const STATUS = {
  CONTINUE: 100,

  SWITCHING_PROTOCOLS: 101,

  PROCESSING: 102,

  OK: 200,

  CREATED: 201,

  ACCEPTED: 202,

  NON_AUTHORITATIVE_INFORMATION: 203,

  NO_CONTENT: 204,

  RESET_CONTENT: 205,

  PARTIAL_CONTENT: 206,

  MULTI_STATUS: 207,

  MULTIPLE_CHOICES: 300,

  MOVED_PERMANENTLY: 301,

  MOVED_TEMPORARILY: 302,

  SEE_OTHER: 303,

  NOT_MODIFIED: 304,

  USE_PROXY: 305,

  TEMPORARY_REDIRECT: 307,

  PERMANENT_REDIRECT: 308,

  BAD_REQUEST: 400,

  UNAUTHORIZED: 401,

  PAYMENT_REQUIRED: 402,

  FORBIDDEN: 403,

  NOT_FOUND: 404,

  METHOD_NOT_ALLOWED: 405,

  NOT_ACCEPTABLE: 406,

  PROXY_AUTHENTICATION_REQUIRED: 407,

  REQUEST_TIMEOUT: 408,

  CONFLICT: 409,

  GONE: 410,

  LENGTH_REQUIRED: 411,

  PRECONDITION_FAILED: 412,

  REQUEST_TOO_LONG: 413,

  REQUEST_URI_TOO_LONG: 414,

  UNSUPPORTED_MEDIA_TYPE: 415,

  REQUESTED_RANGE_NOT_SATISFIABLE: 416,

  EXPECTATION_FAILED: 417,

  IM_A_TEAPOT: 418,

  INSUFFICIENT_SPACE_ON_RESOURCE: 419,

  METHOD_FAILURE: 420,

  MISDIRECTED_REQUEST: 421,

  UNPROCESSABLE_ENTITY: 422,

  LOCKED: 423,
  FAILED_DEPENDENCY: 424,

  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,

  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,

  UNAVAILABLE_FOR_LEGAL_REASONS: 451,

  INTERNAL_SERVER_ERROR: 500,

  NOT_IMPLEMENTED: 501,

  BAD_GATEWAY: 502,

  SERVICE_UNAVAILABLE: 503,

  GATEWAY_TIMEOUT: 504,

  HTTP_VERSION_NOT_SUPPORTED: 505,

  INSUFFICIENT_STORAGE: 507,

  NETWORK_AUTHENTICATION_REQUIRED: 511,
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message, statusCode) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message = MESSAGE.FORBIDDEN, statusCode = STATUS.FORBIDDEN) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = MESSAGE.NOT_FOUND, statusCode = STATUS.NOT_FOUND) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = MESSAGE.NON_AUTHORITATIVE_INFORMATION,
    statusCode = STATUS.NON_AUTHORITATIVE_INFORMATION
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = MESSAGE.BAD_REQUEST, statusCode = STATUS.BAD_REQUEST) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  ForbiddenError,
  NotFoundError,
  AuthFailureError,
  BadRequestError,
};
