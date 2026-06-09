import { pool } from "../db/connection/connection.js";

const getAll = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM v_medicos"
  );

  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM medicos WHERE id_medico = ?",
    [id]
  );

  return rows[0];
};

const asociarObrasSociales = async (id_medico, obras_sociales) => {

  const conexion = await pool.getConnection();

  try {

    await conexion.beginTransaction();

    for (const os of obras_sociales) {

      await conexion.query(
        `INSERT INTO medicos_obras_sociales
         (id_medico, id_obra_social)
         VALUES (?, ?)`,
        [id_medico, os.id_obra_social]
      );

    }

    await conexion.commit();

    return true;

  } catch (error) {

    await conexion.rollback();

    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("La obra social ya está asociada a este médico");
    }

    throw error;

  } finally {

    conexion.release();

  }

};

export default {
  getAll,
  getById,
  asociarObrasSociales
};