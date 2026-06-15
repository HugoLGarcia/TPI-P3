import { pool } from "../db/connection/connection.js";

const create = async (data) => {
  const {
    id_usuario,
    id_especialidad,
    matricula,
    descripcion,
    valor_consulta,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO medicos
     (id_usuario, id_especialidad, matricula, descripcion, valor_consulta)
     VALUES (?, ?, ?, ?, ?)`,
    [id_usuario, id_especialidad, matricula, descripcion, valor_consulta],
  );

  return {
    id_medico: result.insertId,
    id_usuario,
    id_especialidad,
    matricula,
    descripcion,
    valor_consulta,
  };
};

// Obtener todos los médicos
const getAll = async () => {
  const [rows] = await pool.query("SELECT * FROM v_medicos");

  return rows;
};

// Obtener médicos por especialidad
const getByEspecialidad = async (idEspecialidad) => {
  const sql = `
    SELECT
      m.id_medico,
      m.id_usuario,
      u.apellido,
      u.nombres,
      u.email,
      u.foto_path,
      m.id_especialidad,
      e.nombre AS especialidad,
      m.matricula,
      m.descripcion,
      m.valor_consulta
    FROM medicos m
    INNER JOIN usuarios u
      ON u.id_usuario = m.id_usuario
    INNER JOIN especialidades e
      ON e.id_especialidad = m.id_especialidad
    WHERE m.id_especialidad = ?
    AND u.activo = 1
    AND e.activo = 1
  `;

  const [rows] = await pool.query(sql, [idEspecialidad]);

  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM medicos WHERE id_medico = ?",
    [id],
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
        [id_medico, os],
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
  asociarObrasSociales,
  create,
  getByEspecialidad,
};
