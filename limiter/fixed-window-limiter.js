const redis = require("../redis-client");

//This works assuming the time window is always one minute
class FixedWindowLimiterss {
  constructor(limit) {
    this.limit = limit;
    this.ttl = 1 * 60;
  }
  async handleLimit(key) {
    let isBlocked = false,
      retryAfterInMilli = null;

    const currentMinute = new Date().getMinutes();
    const currentKey = `${key}:${currentMinute}`;
    let currentLimitation = await redis.get(currentKey);

    if (currentLimitation >= this.limit) {
      isBlocked = true;
      retryAfterInMilli =
        this.ttl * 1000 -
        (new Date().getTime() - new Date().setMinutes(currentMinute, 0, 0));
    }

    if (!isBlocked) {
      currentLimitation = await redis.incrby(currentKey, 1);

      await redis.expire(currentKey, this.ttl);
    }

    return {
      isBlocked,
      retryAfterInMilli,
      remainingRequests: this.limit - currentLimitation,
      limit: this.limit,
      windowLimitInSec: this.ttl,
    };
  }
}
module.exports = FixedWindowLimiterss;
