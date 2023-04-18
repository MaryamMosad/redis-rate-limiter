const redis = require("../redis-client");

class TokenBucketLimiter {
  constructor(limit, durationInMin) {
    this.limit = limit;
    this.ttl = durationInMin * 60;
  }

  async handleLimit(key) {
    const lastResetKey = `${key}:last:updated`,
      tokenBucketKey = `${key}:count`;
    const lastReset = await redis.get(lastResetKey);
    if (new Date().getTime() - lastReset >= this.ttl * 1000) {
      console.log("Blocking interval passed , Refilling...");

      await redis.set(lastResetKey, new Date().getTime());
      await redis.set(tokenBucketKey, this.limit);
    }

    const tokensLeft = await redis.get(tokenBucketKey);

    if (tokensLeft <= 0) throw new Error("Rate Limited");

    redis.decrby(tokenBucketKey, 1);
  }
}
module.exports = TokenBucketLimiter;
