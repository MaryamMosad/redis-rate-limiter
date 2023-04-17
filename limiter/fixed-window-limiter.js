const redis = require("../redis-client");

const fixedWindowLimiter = async (limit, durationInMin, key) => {
  const currentKey = `${key}:${new Date().getMinutes()}`;
  const currentLimitation = await redis.get(currentKey);
  if (currentLimitation >= limit) {
    throw new Error("Rate Limited");
  }
  await redis.incrby(currentKey, 1);
  await redis.expire(currentKey, durationInMin * 60);
};

exports.limiter = async (res, next) => {
  try {
    await fixedWindowLimiter(10, 1, "fixed:window");
  } catch (err) {
    console.log(err.message);
    if (err.message === "Rate Limited")
      return res.status(429).json({ error: "Ooops, you've been rate limited" });
    return res.status(500).json({ error: "Something Went Wrong!!" });
  }
  next();
};
