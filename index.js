const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const limiter = require("./limiter/fixed-window-limiter").limiter;

app.use(bodyParser.json());

app.use((req, res, next) => limiter(res, next));

app.get("/", (req, res) =>
  res.json({ data: "Congrats, your request was successful" })
);

app.listen(8080, () => {
  console.log("app started on port 8080 🚀");
});

module.exports = app;
