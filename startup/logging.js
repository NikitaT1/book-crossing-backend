const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  process.on("unhandledRejection", (ex) => {
    console.log("An unhandled Rejection");
    winston.error(ex.message, ex);
    process.exit(1);
  });
  process.on("uncaughtException", (ex) => {
    console.log("An uncaught Exception");
    winston.error(ex.message, ex);
    process.exit(1);
  });

  winston.add(winston.transports.File, { filename: "logfile.log" });
};
