require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const router = require("./router");

(async () => {
  await router(app);
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();
