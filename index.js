const express = require("express");
const app = express();
const limiters = require("./limiter/limiters");

app.get("/fixed-window", limiters.fixedWindowLimiter, (req, res) =>
  res.json({ data: "Congrats, your request was successful" })
);

app.get("/token-bucket", limiters.tokenBucketLimiter, (req, res) =>
  res.json({ data: "Congrats, your request was successful" })
);

app.get("/leaky-bucket", limiters.leakyBucketLimiter, (req, res) =>
  res.json({ data: "Congrats, your request was successful" })
);

app.get("/sliding-window", limiters.slidingWindowLimiter, (req, res) =>
  res.json({ data: "Congrats, your request was successful" })
);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`app started on port ${port} 🚀`);
});

module.exports = app;
