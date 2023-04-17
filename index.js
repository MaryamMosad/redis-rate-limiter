const express = require("express");
const app = express();
const limiters = require("./limiter/limiters");

app.get(
  "/fixed-window",
  (req, res, next) => limiters.fixedWindowLimiter(res, next),
  (req, res) => res.json({ data: "Congrats, your request was successful" })
);

app.get(
  "/token-bucket",
  (req, res, next) => limiters.tokenBucketLimiter(res, next),
  (req, res) => res.json({ data: "Congrats, your request was successful" })
);
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`app started on port ${port} 🚀`);
});

module.exports = app;
