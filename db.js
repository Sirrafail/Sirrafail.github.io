const sql = require("mssql");

const dbConfig = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    enableArithAbort: true,
    encrypt: false, // Disable SSL encryption
  },
};

const appPool = new sql.ConnectionPool(dbConfig);

module.exports = appPool;
