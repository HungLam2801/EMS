require("dotenv").config();
const db = require("../pgsql.js");

const funcJSON = (func, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.read_db("*", `${func}${data}`, "", function (result) {
        if (result.rowCount >= 1) {
          resolve(result.rows[0][func]);
        } else {
          resolve({ status: false, number: 254, mess: "DB Err" });
        }
      });
    } catch (error) {
      resolve({ status: false, number: 255, mes: "System Err" });
    }
  });
};

const funcTable = (func, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.read_db("*", `${func}${data}`, "", function (result) {
        if (result.rowCount >= 1) {
          resolve({ status: true, data: result.rows });
        } else {
          resolve({ status: true, data: [] });
        }
      });
    } catch (error) {
      console.log(error);
      resolve({ status: false, number: 255, mes: "System Err" });
    }
  });
};

module.exports = {
  funcJSON,
  funcTable,
};
