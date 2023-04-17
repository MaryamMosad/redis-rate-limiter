# redis-rate-limiter


## Overview:
A basic implementation for various api rate limiting algorithms 

## Stack:

- NodeJs
- Express.js
- Redis
- Docker 

## Algorithms Included:
- Fixed Window Algorithm.
  - The main idea is to have a key for each passing minute ("keyName:1" for the first minute of the hour)
  - on each request increase the key by 1 until it reaches the maximum allowed limit then block the following requests
  - the next minute a new key is created and begins the cycle and the previous key is expired
- Token Bucket Algorithm
  - we have a "counter" key which is set to maximum allowed limit
  - on each request we decrease the key by 1 until it gets to 0 then block the following requests
  - we have a "lastReset" key to indicate when the bucket was refilled ,the key is set on the first request <br />
  and reset when the difference between its value and current time is greater than the allowed duration

## How to start
make sure to set the appropriate environment variables then `docker-compose up`
