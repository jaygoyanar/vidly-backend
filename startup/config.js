const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: vidly_jwtPrivateKey is not defined.");
  }
};
