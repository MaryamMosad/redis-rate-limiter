const fixedWindowLimiter = require("./fixed-window-limiter").limiter;
const tokenBucketLimiter = require("./token-bucket-limiter").limiter;

module.exports = {
  fixedWindowLimiter,
  tokenBucketLimiter,
};
