const FixedWindowLimiter = require("./fixed-window-limiter");
const TokenBucketLimiter = require("./token-bucket-limiter");

const limiterFn = (limiterClass, nameSpace) => {
  return async (req, res, next) => {
    try {
      const limitRes = await limiterClass.handleLimit(nameSpace);

      res.set("RateLimit-Remaining", limitRes.remainingRequests);

      //number of requests and limit in seconds
      res.set(
        "RateLimit-Policy",
        `${limitRes.limit};w=${limitRes.windowLimitInSec}`
      );

      if (limitRes.isBlocked) {
        res.status(429);
        //time remaining until reset in seconds
        res.set(
          "RateLimit-Reset",
          (limitRes.retryAfterInMilli / 1000).toFixed(0)
        );

        res.json({ error: "Ooops, you've been rate limited" });
        return res;
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ error: "Something Went Wrong!!" });
    }
    next();
  };
};

const fixedWindowLimiter = new FixedWindowLimiter(10);
const tokenBucketLimiter = new TokenBucketLimiter(10, 1);

module.exports = {
  fixedWindowLimiter: limiterFn(fixedWindowLimiter, "fixed:window"),
  tokenBucketLimiter: limiterFn(tokenBucketLimiter, "token:bucket"),
};
