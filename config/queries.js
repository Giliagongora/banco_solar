// const pool = require("../config/ddbb.js");
// const errores = require("../errores/errores.js");
const  {errores}  = require("../errores/errores.js");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  hots: "localhost",
  password: "gongora",
  database: "bancosolar",
  port: 5432,
});

// console.log(pool);

// module.exports = { pool };

const agregarUsuario = async (nombre, balance) => {
  try {
    const res = await pool.query(
      "insert into usuarios (nombre, balance) values($1 , $2) RETURNING*",
      [nombre, balance]
    );

    console.log("Registro agregado : ", res.rows[0]);
  } catch (error) {
    console.log("error",error, error.message);
  }
};

const obtenerUsuarios = async () => {
  try {
    const res = await pool.query("SELECT * FROM usuarios");
    console.log("Usuarios registrados : ", res.rows);
    return res.rows;
  } catch (error) {
    // console.error('Se produjo un error:', error.status, error.message);
    console.log("error",error, error.message);
    throw { error: error.message };
  }
};

const eliminarUsuario = async (id) => {
  try {
    const res = await pool.query(
      `DELETE FROM usuarios  WHERE id = $1 RETURNING *`,
      [id]
    );
    console.log("Usuarios eliminados : ", res.rows);
  } catch (error) {
    console.log("error",error, error.message);
    throw { error: error.message };
  }
};

const actualizarUsuario = async (id, nombre, balance) => {
  try {
    const res = await pool.query(
      "UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *",
      [nombre, balance, id]
    );
    console.log("Usuarios actualizado : ", res);
    // return res.rows;
  } catch (error) {
    console.log("error",error, error.message);
    throw { error: error.message };
  }
};
// actualizarUsuario("Fabian", 1000, 2);

const transferencia = async (emisor, receptor, monto) => {
  try {
    const res = await pool.query("BEGIN");
    const cargo = await pool.query(
      "UPDATE usuarios SET balance = balance - $1 WHERE id = $2 RETURNING *",
      [monto, emisor]
    ); // Resta el monto ($1) del saldo (balance) del usuario que tiene el ID (id) especificado ($2).
    console.log("Respuesta de la consulta:", cargo.rows);
    console.log("Transferencias realizada:", cargo.rows[0]);
    console.log(cargo);

    
    const actualAbono = await pool.query(
      "UPDATE usuarios SET balance = balance + $1 WHERE id = $2 RETURNING *",
      [monto, emisor]
    );
    
    console.log("Actualización de abono realizada:", actualAbono.rows);
    console.log(actualAbono);
    
    // const actualizarUsuarios = await pool.query(
    //   "INSERT INTO transferencias  (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *",
    //   [emisor, receptor, monto]
    // );
    
    // console.log("Actualización de usuario realizada:", actualizarUsuario.rows);
    // console.log(actualizarUsuarios);
    
    // await pool.query("COMMIT");
    
    // console.log("Commit realizado");
    
    // const abonoConfirmado = await pool.query(actualizarUsuarios);
    
    // console.log("Transferencias registradas:", res.rows[0]);
    // return res.rows;
    


  } catch (error) {

    console.log("error",error, error.message);
    throw { error: error.message };
  }

};

transferencia(1,55,100);
// const emisor = 1; // ID del emisor
// const receptor = 2; // ID del receptor
// const monto = 100; // Monto de la transferencia


module.exports = {
  pool,
  agregarUsuario,
  obtenerUsuarios,
  eliminarUsuario,
  actualizarUsuario,
  // transferencias,
  transferencia,
};
