const express = require("express");
const app = express();
const port = 3000;
const sql = require("mssql");
const path = require("path");

// Configure MSSQL database connection
const dbConfig = {
  server: "MIS-DEV4", // Replace this with the name or IP address of your MSSQL server
  user: "User",
  password: "User1234!",
  database: "FeedbackDB",
  options: {
    enableArithAbort: true,
    encrypt: false, // Disable SSL encryption
  },
};

// Middleware to parse the incoming data from forms
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static("public"));

// Serve the index.html as the starting page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Serve the feedback form HTML
app.get("/views/feedback-form.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "feedback-form.html"));
});

// Handle the form submission
app.post("/submit", (req, res) => {
  const { q1, q2, q3, q4, q5 } = req.body;

  // Insert the feedback data into the database using a parameterized query
  const query =
    "INSERT INTO Feedback (q1, q2, q3, q4, q5) VALUES (@q1, @q2, @q3, @q4, @q5)";
  const values = {
    q1: { type: sql.Int, val: q1 },
    q2: { type: sql.Int, val: q2 },
    q3: { type: sql.Int, val: q3 },
    q4: { type: sql.Int, val: q4 },
    q5: { type: sql.Int, val: q5 },
  };

  // Connect to the MSSQL database and execute the query
  sql.connect(dbConfig, (err) => {
    if (err) {
      console.error("Error connecting to MSSQL:", err);
      res.status(500).send("An error occurred while processing your feedback.");
    } else {
      const request = new sql.Request();

      // Bind the parameterized values to the request
      for (const key in values) {
        request.input(key, values[key].type, values[key].val);
      }

      request.query(query, (err, result) => {
        if (err) {
          console.error("Error:", err);
          res
            .status(500)
            .send("An error occurred while processing your feedback.");
        } else {
          // Redirect to the thank-you page or handle the response as needed
          res.redirect("/thank-you");
        }
      });
    }
  });
});

// Serve the thank-you page
app.get("/thank-you", (req, res) => {
  const name = req.query.name;
  const feedback = req.query.feedback;
  res.sendFile(path.join(__dirname, "views", "thank-you.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
