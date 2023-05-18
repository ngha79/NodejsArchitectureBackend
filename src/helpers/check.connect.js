"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECOND = 5000;
const countConnect = () => {
  const number = mongoose.connections.length;
  console.log(`Number of connection:: ${number}`);
};

const checkOverload = () => {
  setInterval(() => {
    const numberConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnections = numCores * 5;
    console.log(`Active connections:: ${numberConnection}`);

    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);

    if (numberConnection > maxConnections) {
      console.log(`Connection overload detected!`);
    }
  }, _SECOND);
};

module.exports = { countConnect, checkOverload };
