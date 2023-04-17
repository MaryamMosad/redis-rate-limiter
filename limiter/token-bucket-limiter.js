const redis = require("../redis-client");

const tokenBucketLimiter = async (tokens, durationInMin, key) => {
  const lastResetKey = `${key}:last:updated`,
    tokenBucketKey = `${key}:count`;
  const lastReset = await redis.get(lastResetKey);
  if (new Date().getTime() - lastReset >= durationInMin * 60 * 1000) {
    console.log("Blocking interval passed , Refilling...");

    await redis.set(lastResetKey, new Date().getTime());
    await redis.set(tokenBucketKey, tokens);
  }

  const tokensLeft = await redis.get(tokenBucketKey);

  if (tokensLeft <= 0) throw new Error("Rate Limited");

  redis.decrby(tokenBucketKey, 1);
};

exports.limiter = async (res, next) => {
  try {
    await tokenBucketLimiter(10, 1, "token:bucket");
  } catch (err) {
    console.log(err.message);
    if (err.message === "Rate Limited")
      return res.status(429).json({ error: "Ooops, you've been rate limited" });
    return res.status(500).json({ error: "Something Went Wrong!!" });
  }
  next();
};
