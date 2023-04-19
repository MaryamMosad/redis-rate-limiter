const redis = require("../redis-client");

// on request remove items which are older than limit / duration
class LeakyBucketLimiter {
  constructor(limit, durationInMin) {
    this.limit = limit;
    this.ttl = durationInMin * 60;
  }

  async handleLimit(key) {
    await this.leakRequests(key, this.limit, this.ttl);
    const currentBucketLen = await redis.llen(key);

    if (currentBucketLen < this.limit) {
      await redis.rpush(key, new Date().getTime());
    }

    return {
      isBlocked: currentBucketLen >= this.limit,
      retryAfterInMilli: null,
      remainingRequests: this.limit - currentBucketLen,
      limit: this.limit,
      windowLimitInSec: this.ttl,
    };
  }

  async leakRequests(key) {
    const oldestReq = await redis.lrange(key, 0, 0);

    const secondsPassedSinceOldestRequest =
      (new Date().getTime() - oldestReq[0]) / 1000;

    const leakingRatePerSec = this.limit / this.ttl;

    const numberOfElementsToRemove = Math.floor(
      secondsPassedSinceOldestRequest * leakingRatePerSec
    );

    if (numberOfElementsToRemove > 0) {
      await redis.lpop(key, numberOfElementsToRemove);
    }
  }
}
module.exports = LeakyBucketLimiter;
