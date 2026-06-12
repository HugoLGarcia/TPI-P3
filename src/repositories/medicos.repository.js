import { pool } from "../db/connection/connection.js";

// Obtener médicos activos
const getAll = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM v_medicos WHERE activo = 1"
  );

  return rows;
};

// Obtener médico por ID
const getById = async (id) => {
  const [rows] = await pool.query(
    `SELECT *
     FROM v_medicos
     WHERE id_medico = ?
     AND activo = 1`,
    [id]
  );

  return rows[0];
};

// Asociar médico a obra social
//Transacción
async function asociarMedicoConObraSocial(id_medico, obras_sociales) {
  const connection = await pool.getConnection(); 

try {
    await connection.beginTransaction(); 

    // 1. Insertar Usuario
    for (const os of obras_sociales) {
    const sql = `INSERT INTO medicos_obras_sociales (id_medico, id_obra_social) VALUES (?, ?)`;
    await connection.query(sql, [id_medico, os.id_obra_social]);
    }

    await connection.commit(); 
    return true;

} catch (error) {
    await connection.rollback(); // Si algo falló, deshacemos TODO
} finally {
    connection.release(); // IMPORTANTE: Devolver la conexión al pool
}
  
};

// No se implementa
// Asociar médico con especialidad
//Transacción
/*
async function asociarMedicoConEspecialidad(id_medico, especialidades) {
  const connection = await pool.getConnection(); 

try {
    await connection.beginTransaction(); 

    // 1. Insertar Usuario
    for (const esp of especialidades) {
    const sql = `INSERT INTO medicos_especialidades (id_medico, id_especialidad) VALUES (?, ?)`;
    await connection.query(sql, [id_medico, esp.id_especialidad]);
    }

    await connection.commit(); 
    return true;

} catch (error) {
    await connection.rollback(); // Si algo falló, deshacemos TODO
} finally {
    connection.release(); // IMPORTANTE: Devolver la conexión al pool
}
};
*/

export default {
  getAll,
  getById,
  asociarMedicoConObraSocial,
  //asociarMedicoConEspecialidad
};