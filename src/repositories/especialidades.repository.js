import { pool } from "../db/connection/connection.js";

// Obtener todas las especialidades activas
const getAll = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM especialidades WHERE activo = 1"
  );

  return rows;
};

// Obtener especialidad por ID
const getById = async (id) => {
  const [rows] = await pool.query(
    `SELECT *
     FROM especialidades
     WHERE id_especialidad = ?
     AND activo = 1`,
    [id]
  );

  return rows[0];
};

// Crear especialidad
const create = async (data) => {
  const { nombre } = data;

  const [result] = await pool.query(
    `INSERT INTO especialidades
     (nombre, activo)
     VALUES (?, 1)`,
    [nombre]
  );

  return {
    id: result.insertId
  };
};

// Actualizar especialidad
const update = async (id, data) => {
  const campos = [];
  const valores = [];

  if (data.nombre !== undefined && data.nombre !== "") {
    campos.push("nombre = ?");
    valores.push(data.nombre);
  }

  if (campos.length === 0) {
    throw new Error("No hay campos para actualizar");
  }

  valores.push(id);

  const [result] = await pool.query(
    `UPDATE especialidades
     SET ${campos.join(", ")}
     WHERE id_especialidad = ?
     AND activo = 1`,
    valores
  );

  if (result.affectedRows === 0) {
    throw new Error("Especialidad no encontrada o inactiva");
  }

  return {
    message: "Especialidad actualizada"
  };
};

// Eliminar especialidad (soft delete)
const softDelete = async (id) => {
  const [result] = await pool.query(
    `UPDATE especialidades
     SET activo = 0
     WHERE id_especialidad = ?
     AND activo = 1`,
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Especialidad no encontrada o ya eliminada");
  }

  return {
    message: "Especialidad eliminada"
  };
};

export default {
  getAll,
  getById,
  create,
  update,
  softDelete
};