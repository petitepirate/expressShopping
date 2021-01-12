const express = require("express")
const app = express();
const shopRoutes = require("./shopRoutes")
const ExpressError = require("./expressError")

app.use(express.json());
app.use("/items", shopRoutes);

/** 404 handler */

app.use(function(req, res, next) {
  return new ExpressError("Not Found", 404);
});

/** general error handler */

app.use((err, req, res, next) => {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.message;

  // set the status and alert the user
  return res.status(status).json({
    error: message
  });
});

module.exports = app;
