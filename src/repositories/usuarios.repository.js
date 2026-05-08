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

//Auxiliar para uso en borrarUsuarioId, no se exporta
async function getStateId(id) {
  try {
    const sqlQuery = 'SELECT activo FROM usuarios WHERE id_usuario = ?';
    const [rows] = await pool.query(sqlQuery, [id]);

    if (rows.length === 0) {
      console.log(`No se encontró un usuario con id_usuario = ${id}`);
      return { error: `No se encontró un usuario con id_usuario = ${id}` };
    } else {
      console.log('Query results:', rows[0].activo);
      return (rows[0].activo);
    }
  } catch (err) {
    console.error('Error executing SELECT query:', err);
  }
}


};
// Cambiar estado de usuario por ID (activo/inactivo)
async function changeStateId(id) {
  const estadoActual = await getStateId(id);
  const nuevoEstado = estadoActual === 1 ? 0 : 1;
  const estado = nuevoEstado === 1 ? 'activo' : 'inactivo';
  try {
    const sqlQuery = 'UPDATE usuarios SET activo = ? WHERE id_usuario = ?';
    const [result] = await pool.query(sqlQuery, [nuevoEstado, id]);
    if (result.affectedRows === 0) {
      console.log(`No se encontró un usuario con id_usuario = ${id}`);
      return { error: `No se encontró un usuario con id_usuario = ${id}` };
    } else {
      console.log('Query results:', result);
      return { message: `Estado de usuario (id_usuario = ${id}) modificado con éxito a ${estado}` };
    }
  } catch (err) {
    console.error('Error executing UPDATE query:', err)};
};

// Cambiar correo de usuario por ID
  async function changeEmailId(id, email) {
  try {
    const sqlQuery = 'UPDATE usuarios SET email = ? WHERE id_usuario = ?';
    if (!email) {
      return { error: 'Faltan correo obligatorios' };
    }
    const [result] = await pool.query(sqlQuery, [email, id]);
    return { message: `Correo de usuario (id_usuario = ${id}) modificado con éxito a ${email}` };
  } catch (error) {
    console.error('Error al ejecutar UPDATE query:', error);
    return {'Error' : 'Error al ejecutar UPDATE query' + error.message + ' en: ' + error.sql};
  }
};

// Registrar usuario genérico (médico o paciente, dependiendo de los datos enviados)
async function registerGeneric(datos) {
  const { documento, apellido, nombres, email, contrasenia, foto_path, rol } = datos;

  const connection = await pool.getConnection(); // Pedís una conexión fija del pool

try {
    await connection.beginTransaction(); // Iniciás transacción formal

    // 1. Insertar Usuario
    const [userResult] = await connection.query(
        `INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        [documento, apellido, nombres, email, contrasenia, foto_path, rol]
    );

    const v_id_usuario = userResult.insertId; // Obtenés el ID directamente en JS

    // 2. Insertar según Rol (Aquí el id_obra_social NO será NULL)
    if (rol === 2) {
        await connection.query(
            `INSERT INTO pacientes (id_usuario, id_obra_social) VALUES (?, ?)`,
            [v_id_usuario, datos.id_obra_social] // Pasamos el valor directo aquí
        );
    } else if (rol === 1) {
        await connection.query(
            `INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) VALUES (?, ?, ?, ?, ?)`,
            [v_id_usuario, datos.especialidad, datos.matricula, datos.descripcion, datos.valor_consulta]
        );
    }

    await connection.commit(); // Si todo salió bien, confirmamos
    console.log("Registro exitoso");
    return { success: true, id_usuario: v_id_usuario }; // Devolvemos el ID del nuevo usuario

} catch (error) {
    await connection.rollback(); // Si algo falló, deshacemos TODO
    console.error("Error, se hizo rollback:", error);
    throw error;
} finally {
    connection.release(); // IMPORTANTE: Devolver la conexión al pool
}
  
};

export default {
  getAll,
  getById,
  create,
  update,
  softDelete,
  search,
  changeStateId,
  changeEmailId,
  registerGeneric
};