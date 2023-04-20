# redis-rate-limiter

## Overview:

A basic api rate limiter for blocking further requests from being processed for a specific duration <br />
after exceeding the maximum allowed requests count. Implementing various rate limiting algorithms using redis as a datastore <br />
It contains a limited number of endpoints, one for each algorithm, for testing and demonstration purposes.

## Stack:

- NodeJs
- Express.js
- Redis
- Docker

## Algorithms Included:

- Fixed Window Algorithm:
  - The main idea is to have a key for each passing minute ("keyName:1" for the first minute of the hour)
  - on each request increase the key by 1 until it reaches the maximum allowed limit then block the following requests
  - the next minute a new key is created and begins the cycle and the previous key is expired
- Token Bucket Algorithm:
  - we have a "counter" key which is set to maximum allowed limit
  - on each request we decrease the key by 1 until it gets to 0 then block the following requests
  - we have a "lastReset" key to indicate when the bucket was refilled ,the key is set on the first request <br />
    and reset when the difference between its value and current time is greater than the allowed duration
- Leaky Bucket Algorithm:
  - we have a limited size list that we fill up on each incoming request until it reaches the limit <br />
    then block the following requests
  - over time with constant rate we remove elements from the beginning of the list which allows more requests to be handled
- Sliding Window Algorithm:

  - sorted sets are used to store incoming requests having the current timestamp as both the score and rank.

  - the current window starts at the current time minus the blocking interval which means how many requests <br />
    were made in the past 60 seconds if the blocking interval is a minute for example.
  - remove set members which are older than the current window start then count the remaining requests.

  - if the requests count have exceeded the limit then block it otherwise allow it and add another member to the list

## How to start

make sure to set the appropriate environment variables then `docker-compose up`
