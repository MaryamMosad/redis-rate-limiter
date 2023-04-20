const redis = require("../redis-client");

class TokenBucketLimiter {
  constructor(limit, durationInMin) {
    this.limit = limit;
    this.ttl = durationInMin * 60;
  }

  async handleLimit(key) {
    let isBlocked = false,
      retryAfterInMilli = null;

    const lastResetKey = `${key}:last:updated`,
      tokenBucketKey = `${key}:count`;
    const lastReset = await redis.get(lastResetKey);
    if (new Date().getTime() - lastReset >= this.ttl * 1000) {
      console.log("Blocking interval passed , Refilling...");

      await redis.multi({ pipeline: false });
      await redis.set(lastResetKey, new Date().getTime());
      await redis.set(tokenBucketKey, this.limit);
      await redis.exec();
    }

    let tokensLeft = await redis.get(tokenBucketKey);

    if (tokensLeft <= 0) {
      isBlocked = true;
      retryAfterInMilli = this.ttl * 1000 - (new Date().getTime() - lastReset);
    }

    if (!isBlocked) {
      tokensLeft = await redis.decrby(tokenBucketKey, 1);
    }

    return {
      isBlocked,
      retryAfterInMilli,
      remainingRequests: tokensLeft,
      limit: this.limit,
      windowLimitInSec: this.ttl,
    };
  }
}
module.exports = TokenBucketLimiter;
