const redis = require("../redis-client");

class FixedWindowLimiterss {
  constructor(limit, durationInMin) {
    this.limit = limit;
    this.ttl = durationInMin * 60;
  }
  async handleLimit(key) {
    const currentKey = `${key}:${new Date().getMinutes()}`;
    const currentLimitation = await redis.get(currentKey);
    if (currentLimitation >= this.limit) {
      throw new Error("Rate Limited");
    }
    await redis.incrby(currentKey, 1);
    await redis.expire(currentKey, this.ttl);
  }
}
module.exports = FixedWindowLimiterss;
