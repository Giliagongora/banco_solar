// import pkg, { Connection } from "pg";
// import dotenv from "dotenv";
const dotenv = require('dotenv');
// const { Pool } = pkg;
dotenv.config();
const pkg = require("pg");
const { Connection } = require("pg");


const {HOST, DATABASE, USER, PASSWORD, PORT } = process.env


const { Pool } = require('pg');

const pool = new Pool({
  host: HOST,
  database: DATABASE,
  user: USER,
  password: PASSWORD,
  port: PORT,
  allowExitOnIdle: true,
});


//console.log("Valor de pool: ", pool);

async function connectToDatabase() {
  try {
    console.log("Database connected");
    await pool.query("SELECT NOW()");
    //console.log("Database connected after");
  } catch (error) {
    console.log(error);
  }
}
// console.log(connectToDatabase);





module.exports = { 
  pool,
  connectToDatabase
};
