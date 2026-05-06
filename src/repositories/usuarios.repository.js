import { pool } from "../db/connection/connection.js";

// B
const getAll = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE activo = 1"
  );
  return rows;
};

// R
const getById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE id_usuario = ? AND activo = 1",
    [id]
  );
  return rows[0];
};

// A
const create = async (data) => {
  const { documento, apellido, nombres, email, contrasenia, rol } = data;

  const [result] = await pool.query(
    `INSERT INTO usuarios 
    (documento, apellido, nombres, email, contrasenia, rol, activo)
    VALUES (?, ?, ?, ?, ?, ?, 1)`,
    [documento, apellido, nombres, email, contrasenia, rol]
  );

  return { id: result.insertId };
};

// E
const update = async (id, data) => {
  const campos = [];
  const valores = [];

  if (data.apellido !== undefined && data.apellido !== "") {
    campos.push("apellido = ?");
    valores.push(data.apellido);
  }

  if (data.nombres !== undefined && data.nombres !== "") {
    campos.push("nombres = ?");
    valores.push(data.nombres);
  }

  if (data.email !== undefined && data.email !== "") {
    campos.push("email = ?");
    valores.push(data.email);
  }

  if (data.contrasenia !== undefined && data.contrasenia !== "") {
    campos.push("contrasenia = ?");
    valores.push(data.contrasenia);
  }

  if (campos.length === 0) {
    throw new Error("No hay campos para actualizar");
  }

  valores.push(id);

  await pool.query(
    `UPDATE usuarios SET ${campos.join(", ")} WHERE id_usuario = ?`,
    valores
  );

  return { message: "Usuario actualizado" };
};

// D (SOFT DELETE)
const softDelete = async (id) => {
  await pool.query(
    "UPDATE usuarios SET activo = 0 WHERE id_usuario = ?",
    [id]
  );

  return { message: "Usuario eliminado (soft delete)" };
};

export default {
  getAll,
  getById,
  create,
  update,
  softDelete
};