import { pool } from "../db/connection/connection.js";

// Obtener todas las obras sociales activas
const getAll = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM obras_sociales WHERE activo = 1"
  );

  return rows;
};

// Obtener una obra social por ID
const getById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM obras_sociales WHERE id_obra_social = ? AND activo = 1",
    [id]
  );

  return rows[0];
};

// Crear obra social
const create = async (data) => {
  const {
    nombre,
    descripcion,
    porcentaje_descuento,
    es_particular
  } = data;

  const [result] = await pool.query(
    `INSERT INTO obras_sociales
    (nombre, descripcion, porcentaje_descuento, es_particular, activo)
    VALUES (?, ?, ?, ?, 1)`,
    [
      nombre,
      descripcion,
      porcentaje_descuento,
      es_particular
    ]
  );

  return {
    id: result.insertId
  };
};

// Actualizar obra social
const update = async (id, data) => {

  const campos = [];
  const valores = [];

  if (data.nombre !== undefined) {
    campos.push("nombre = ?");
    valores.push(data.nombre);
  }

  if (data.descripcion !== undefined) {
    campos.push("descripcion = ?");
    valores.push(data.descripcion);
  }

  if (data.porcentaje_descuento !== undefined) {
    campos.push("porcentaje_descuento = ?");
    valores.push(data.porcentaje_descuento);
  }

  if (data.es_particular !== undefined) {
    campos.push("es_particular = ?");
    valores.push(data.es_particular);
  }

  if (campos.length === 0) {
    throw new Error("No hay datos para actualizar");
  }

  valores.push(id);

  const [result] = await pool.query(
    `UPDATE obras_sociales
     SET ${campos.join(", ")}
     WHERE id_obra_social = ?
     AND activo = 1`,
    valores
  );

  if (result.affectedRows === 0) {
    throw new Error("Obra social no encontrada");
  }

  return {
    mensaje: "Obra social actualizada"
  };
};

// Soft Delete
const softDelete = async (id) => {

  const [result] = await pool.query(
    `UPDATE obras_sociales
     SET activo = 0
     WHERE id_obra_social = ?
     AND activo = 1`,
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Obra social no encontrada");
  }

  return {
    mensaje: "Obra social eliminada"
  };
};

export default {
  getAll,
  getById,
  create,
  update,
  softDelete
};