require("express-async-errors");
const winston = require("winston");
// require("winston-mongodb");

module.exports = function () {
  // process.on("uncaughtException", (ex) => {
  //   winston.error(ex.message, ex);
  //   process.exit(1);
  // });
  // process.on("unhandledRejection", (ex) => {
  //   winston.error(ex.message, ex);
  //   process.exit(1);
  // });

  winston.exceptions.handle(
    new winston.transports.File({ filename: "exceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    throw new Error(ex);
  });

  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
    })
  );
  // winston.add(
  //   new winston.transports.MongoDB({
  //     db: "mongodb://localhost/vidly",
  //   })
  // );
};
