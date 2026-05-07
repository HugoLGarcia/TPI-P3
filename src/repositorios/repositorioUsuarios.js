//import dotenv from 'dotenv';
//dotenv.config();

//Uso mysql2/promise para conectarme a MySQL usando promises
import mysql from 'mysql2/promise';

//1️⃣ Se importa para probar una vez por ahora
import { pool } from '../db/conexion/conexion.js';

async function obtenerTodos() {
  try { 
    const sqlQuery = 'SELECT * FROM usuarios WHERE activo = 1';
    const [rows] = await pool.query(sqlQuery);
    return rows;
  } catch (error) {
    console.error('Error al ejecutar SELECT query:', error);
    return {'Error' : 'Error al ejecutar SELECT query' + error.message + ' en: ' + error.sql}; 
  }
};

async function obtenerPorId(id) {
  try { 
    const sqlQuery = 'SELECT * FROM usuarios WHERE id_usuario = ? AND activo = 1';
    const [rows] = await pool.query(sqlQuery, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error al ejecutar SELECT query:' , error);
    return {'Error' : 'Error al ejecutar SELECT query' + error.message + ' en: ' + error.sql}; 
  }
};

async function agregarUnUsuario(datos) {
  const { documento, apellido, nombres, email, contrasenia, foto_path, rol } = datos;
  try {
    const sqlQuery = 'INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?, 1)';
    // ⚠️ Validación básica, esto debería ser un middleware?
    // ⚠️ No debería seguir si no está completo. 
    if (!documento || !apellido || !nombres ||
       !email || !contrasenia || !(foto_path.length >= 0) || !rol) {
      return { error: 'Faltan campos obligatorios' };
    }
    const [result] = await pool.query(sqlQuery, [documento, apellido, nombres, email,
       contrasenia, foto_path, rol]);

    return result.insertId;

  } catch (error) {
   {
    console.error('Error al SELECT query:', error);
    return {'Error' : 'Error al ejecutar INSERT query' + error.message + ' en: ' + error.sql};
  }
};
};

//Auxiliar para uso en borrarUsuarioId, no se exporta
async function estadoUsuarioId(id) {
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

async function modificarEstadoUsuarioId(id) {
  const estadoActual = await estadoUsuarioId(id);
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

  async function modificarCorreoUsuario(id, email) {
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
    
async function registrarUsuarioGenerico(datos) {
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

export { 
    obtenerTodos,
    obtenerPorId,
    agregarUnUsuario,
    modificarEstadoUsuarioId,
    modificarCorreoUsuario,
    registrarUsuarioGenerico
};