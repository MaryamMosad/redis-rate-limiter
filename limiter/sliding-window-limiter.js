const redis = require("../redis-client");

class SlidingWindowLimiter {
  constructor(limit, durationInMin) {
    this.limit = limit;
    this.ttl = durationInMin * 60;
  }

  async handleLimit(key) {
    let isBlocked = false;
    const requestTime = new Date().getTime();
    let firstRequest = null;
    const currentWindowStart = requestTime - this.ttl * 1000;

    await redis.zremrangebyscore(key, "-inf", currentWindowStart);

    const totalRequstsCount = await redis.zcard(key);

    if (totalRequstsCount < this.limit) {
      await redis.zadd(key, requestTime, requestTime);
    } else {
      isBlocked = true;
      firstRequest = await redis.zrange(key, 0, 0);
    }

    return {
      isBlocked: isBlocked,
      retryAfterInMilli: firstRequest
        ? this.ttl * 1000 - (new Date().getTime() - firstRequest[0])
        : null,
      remainingRequests: this.limit - totalRequstsCount,
      limit: this.limit,
      windowLimitInSec: this.ttl,
    };
  }
}
module.exports = SlidingWindowLimiter;
