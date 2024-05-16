// const pool = require("../config/ddbb.js");
// const errores = require("../errores/errores.js");
const { errores } = require("../errores/errores.js");
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
    console.log("error", error, error.message);
    res.status(500).json({ error: error.message });

  }
};

const obtenerUsuarios = async () => {
  try {
    const res = await pool.query("SELECT * FROM usuarios");
    console.log("Usuarios registrados : ", res.rows);
    return res.rows;
  } catch (error) {
    console.log("error", error, error.message);
    res.status(500).json({ error: error.message });
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
    console.log("error", error, error.message);
    res.status(500).json({ error: error.message });
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
    console.log("error", error, error.message);
    res.status(500).json({ error: error.message });
  }
};
// actualizarUsuario("Fabian", 1000, 2);


const transferencia = async (emisor, receptor, monto) => {
  try {
    await pool.query("BEGIN");
    const descontar = await pool.query(
      'UPDATE usuarios SET balance = balance - $1 WHERE id = $2', [monto, emisor]
    ); // Resta el monto ($1) del saldo (balance) del usuario que tiene el ID (id) especificado ($2).

    // console.log("descontar :::::::::::::::",descontar);

// Sumar al usuario 
    const acreditar = await pool.query(
      'UPDATE usuarios SET balance = balance + $1 WHERE id = $2', [monto, receptor]
    );

    // console.log("acreditar :::::::::::::::",acreditar);

    const actualizarUsuarios = await pool.query(
      // "INSERT INTO transferencias  (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *",
      // [emisor, receptor, monto]
      'INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *', [emisor, receptor, monto]
    );
    // return actualizarUsuarios;
    // console.log("actualizarUsuarios :::::::::::::::",actualizarUsuarios);

    const insert = await pool.query("COMMIT");
    // actualizarUsuario();
    console.log("Commit realizado");

    // const abonoConfirmado = await pool.query(actualizarUsuarios);

    // console.log("Transferencias registradas:", res.rows[0]);
    // return insert;
    return ('agregado con éxito');
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log("error", error, error.message);
    return errores(error, pool, 'transferencias');
  }
};
// actualizarUsuario();

// transferencia(2, 58, 1);



const transferencias = async (req, res) => {
  try {
    // const res = await pool.query("SELECT * FROM transferencias");
    const transferenciaEstado = {
      rowMode: "array",
      // seleccionar ciertas columnas de la base de datos.
      text: `
      SELECT t.id, e.nombre AS emisor_nombre, r.nombre AS receptor_nombre, t.monto AS monto_transferencia, t.fecha AS fecha 
      FROM transferencias t 
      INNER JOIN usuarios e ON t.emisor = e.id
      INNER JOIN usuarios r ON t.receptor = r.id;
      `
    }
    // console.log("Transacciones registradas : ", res.rows);
    const resultado = await pool.query(transferenciaEstado);
    return resultado.rows;
    // console.log('transferenciaEstado.row', transferenciaEstado.row);
    // return transferenciaEstado.rows;
  } catch (error) {
    console.log("error", error, error.message);
    return errores(error, pool, 'transferencias');
  }
};



module.exports = {
  pool,
  agregarUsuario,
  obtenerUsuarios,
  eliminarUsuario,
  actualizarUsuario,
  transferencias,
  transferencia,
};
