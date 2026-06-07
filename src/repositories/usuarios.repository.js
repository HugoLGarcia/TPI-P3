import { pool } from "../db/connection/connection.js";

// Obtener todos los usuarios activos
const getAll = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE activo = 1"
  );
  return rows;
};

// Obtener usuario por ID (solo activos)
const getById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE id_usuario = ? AND activo = 1",
    [id]
  );
  return rows[0];
};

// Crear usuario
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

// Actualizar usuario (solo si está activo)
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

  const [result] = await pool.query(
    `UPDATE usuarios
     SET ${campos.join(", ")}
     WHERE id_usuario = ? AND activo = 1`,
    valores
  );

  if (result.affectedRows === 0) {
    throw new Error("Usuario no encontrado o inactivo");
  }

  return { message: "Usuario actualizado" };
};

// Eliminar usuario (soft delete)
const softDelete = async (id) => {
  const [result] = await pool.query(
    "UPDATE usuarios SET activo = 0 WHERE id_usuario = ? AND activo = 1",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Usuario no encontrado o ya eliminado");
  }

  return { message: "Usuario eliminado" };
};

// Buscar usuarios activos por apellido o nombre
const search = async (texto) => {
  const [rows] = await pool.query(
    `SELECT * FROM usuarios
     WHERE activo = 1
     AND (apellido LIKE ? OR nombres LIKE ?)`,
    [`%${texto}%`, `%${texto}%`]
  );

  return rows;
};

// Buscar usuario para login
const buscar = async (email, contrasenia) => {
  const [rows] = await pool.query(
    `SELECT
        id_usuario,
        apellido,
        nombres,
        rol
     FROM usuarios
     WHERE email = ?
     AND contrasenia = ?
     AND activo = 1`,
    [email, contrasenia]
  );

  return rows[0];
};

export default {
  getAll,
  getById,
  create,
  update,
  softDelete,
  search,
  buscar
};