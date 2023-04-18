const FixedWindowLimiter = require("./fixed-window-limiter");
const TokenBucketLimiter = require("./token-bucket-limiter");

const limiterFn = (limiterClass, nameSpace) => {
  return async (req, res, next) => {
    try {
      await limiterClass.handleLimit(nameSpace);
    } catch (err) {
      console.log(err.message);
      if (err.message === "Rate Limited")
        return res
          .status(429)
          .json({ error: "Ooops, you've been rate limited" });
      return res.status(500).json({ error: "Something Went Wrong!!" });
    }
    next();
  };
};

const fixedWindowLimiter = new FixedWindowLimiter(10, 1);
const tokenBucketLimiter = new TokenBucketLimiter(10, 1);

module.exports = {
  fixedWindowLimiter: limiterFn(fixedWindowLimiter, "fixed:window"),
  tokenBucketLimiter: limiterFn(tokenBucketLimiter, "token:bucket"),
};
