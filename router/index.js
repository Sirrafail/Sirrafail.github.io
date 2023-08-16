const express = require("express");
const feedBackControllers = require("../controllers/feedback.conntroller");
const appPool = require("../db");

const router = async (app) => {
  const pool = await appPool.connect();

  // Middleware to parse the incoming data from forms
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from the "public" folder
  app.use(express.static("public"));
  app.use((req, res, next) => {
    req.db = pool;
    next();
  });

  app.get("/", feedBackControllers.getHomePage);
  app.post("/submit", feedBackControllers.submitFeedback);
  // Serve the feedback form HTML
  app.get("/feedback-form", feedBackControllers.getFeedbackFormPage);

  app.get("/thank-you", feedBackControllers.getThankYouPage);
  app.use(feedBackControllers.errorHandler);
};

module.exports = router;
