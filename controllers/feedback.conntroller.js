const path = require("path");
const sql = require("mssql");

exports.getHomePage = async (req, res, next) => {
  try {
    res.sendFile(path.join(process.cwd(), "views", "index.html"));
  } catch (error) {
    next(error);
  }
};

exports.getFeedbackFormPage = async (req, res, next) => {
  try {
    res.sendFile(path.join(process.cwd(), "views", "feedback-form.html"));
  } catch (error) {
    next(error);
  }
};

exports.getThankYouPage = async (req, res, next) => {
  try {
    const name = req.query.name;
    const feedback = req.query.feedback;
    res.sendFile(path.join(process.cwd(), "views", "thank-you.html"));
  } catch (error) {
    next(error);
  }
};

exports.submitFeedback = async (req, res, next) => {
  try {
    const query =
      "INSERT INTO Feedback (q1, q2, q3, q4, q5) VALUES (@q1, @q2, @q3, @q4, @q5)";
    const request = req.db.request();

    Object.entries(req.body).forEach(([key, val]) => {
      request.input(key, sql.Int, val);
    });

    await request.query(query);
    res.redirect("/thank-you");
  } catch (error) {
    next(error);
  }
};
exports.errorHandler = async (err, req, res, next) => {
  res.sendFile(path.join(process.cwd(), "views", "error.html"));
};
