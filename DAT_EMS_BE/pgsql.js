const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  extendedQuery: true,
  rowMode: "array",
});

const connection = async () => {
  try {
    await client.connect();
    console.log("PostgreSQL connected");
  } catch (err) {
    console.error("PostgreSQL connection error:", err.stack);
    throw err;
  }
};

function read_db(select, table, value_db, Callback) {
  if (value_db != "") {
    client.query(
      "SELECT " + select + " FROM " + table + " WHERE " + value_db,
      function (err, result) {
        if (err) {
          console.error("Database query error:", err);
          return Callback(null, err);
        }

        Callback(result, null);
      },
    );
  } else {
    client.query("SELECT " + select + " FROM " + table, function (err, result) {
      if (err) {
        console.error("Database query error:", err);
        return Callback(null, err);
      }

      Callback(result, null);
    });
  }
}

module.exports = {
  connection,
  read_db,
};
