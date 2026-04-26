//❓Podría ser un .js por cada entidad
// y algún otro para consultas complejas❓
//Uso dotenv para levantar el archivo de configuración .env
//⚠️ Creo que deberíamos utilizar el método nativo "process.loadEnvFile();"
// que es el que utilizan Cristian (Pero no Ignacio)
import dotenv from 'dotenv';
dotenv.config();

//Uso mysql2/promise para conectarme a MySQL usando promises
import mysql from 'mysql2/promise';

//1️⃣ Se importa para probar una vez por ahora
import { pool } from '../conexion/conexion.js';

async function getAllUsuarios() {
  try {
    // Creo la conexión
    //Para todas estas funciones deberemos armar la conección
    //de acuerdo a lo que mostró Cristian
    /* 1️⃣ Comentada para usar pool
    const conexion = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    */

    // Defino el string de consulta
    const sqlQuery = 'SELECT * FROM usuarios';

    // Ejecuto la consulta
    // 1️⃣Modificado para uso de pool
    const [rows] = await pool.query(sqlQuery);

    console.log('Query results:', rows);
    // 1️⃣Modificado para uso de pool, se cierra sola ahora?
    await pool.end();

    return rows;

  } catch (err) {
    console.error('Error executing SELECT query:', err);
  }
}

async function getUsuarioById(idUsuario) {
  let conexion;

  try {
    // Creo la conexión
    conexion = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Defino el string de consulta
    const sqlQuery = 'SELECT * FROM usuarios WHERE id_usuario = ?';

    // Ejecuto la consulta
    const [rows] = await conexion.query(sqlQuery, [idUsuario]);

    if (rows.length === 0) {
      console.log(`No se encontró un usuario con id_usuario = ${idUsuario}`);
      return { error: `No se encontró un usuario con id_usuario = ${idUsuario}` };
    } else {
      console.log('Query results:', rows[0]);
      return rows[0];
    }
  } catch (err) {
    console.error('Error executing SELECT query:', err);
  } finally {
    if (conexion) {
      await conexion.end();
    }
  }
   
}

async function getUsuariosByApellido(apellidoParcial) {
  if (apellidoParcial.trim().length < 3) {
    console.log('Debes ingresar al menos 3 caracteres para filtrar por apellido.');
    return { error: 'Debes ingresar al menos 3 caracteres para filtrar por nombre o apellido.' };
  }

  let conexion;

  try {
    // Creo la conexión
    conexion = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Defino el string de consulta
    const sqlQuery = 'SELECT * FROM usuarios WHERE apellido LIKE ? OR nombres LIKE ?';

    // Ejecuto la consulta
    const [rows] = await conexion.query(sqlQuery, [`%${apellidoParcial}%`, `%${apellidoParcial}%`]);

    if (rows.length === 0) {
      console.log(`No se encontraron usuarios con apellido que contenga: ${apellidoParcial}`);
      return { error: `No se encontraron usuarios con apellido que contenga: ${apellidoParcial}` };
    } else {
      console.log('Query results:', rows);
      return rows;
    }
  } catch (err) {
    console.error('Error executing SELECT query:', err);
  } finally {
    if (conexion) {
      await conexion.end();
    }
  }
}

//Ver si utilizaremos inglés o castellano 
//Ver si utilizaremos en los nombres los verbos agregar, obtener, etc.
async function agregarUnUsuario(datos) {
  try {
    // Creo la conexión
    const conexion = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Defino el string de consulta
    const sqlQuery = 'INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    // ⚠️ Validación básica, esto debería ser un middleware?
    // ⚠️ No debería seguir si no está completo. 
    if (!datos.documento || !datos.apellido || !datos.nombres ||
       !datos.email || !datos.contrasenia || !(datos.foto_path >=0)|| !datos.rol || !datos.activo) {
      return { error: 'Faltan campos obligatorios' };
    }

    const [result] = await conexion.execute(sqlQuery, [`${datos.documento}`,
       `${datos.apellido}`, `${datos.nombres}`, `${datos.email}`,
        `${datos.contrasenia}`, `${datos.foto_path}`, `${datos.rol}`,
         `${datos.activo}`]);

    return result;
        
    await conexion.end();

  } catch (err) {
    console.error('Error executing SELECT query:', err);
  }
}

async function borrarUsuarioPorId(idUsuario) {
  //1️⃣ Comentada para usar pool
  //let conexion;

  try {
    // Creo la conexión
    /* 1️⃣ Comentada para usar pool
    conexion = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    */

    // Defino el string de consulta
    const sqlQuery = 'DELETE FROM usuarios WHERE id_usuario = ?';

    // Ejecuto la consulta
    // 1️⃣Modificada para uso de pool
    const [result] = await pool.query(sqlQuery, [idUsuario]);

    if (result.affectedRows === 0) {
      console.log(`No se encontró un usuario con id_usuario = ${idUsuario}`);
      return { error: `No se encontró un usuario con id_usuario = ${idUsuario}` };
    } else {
      console.log('Query results:', result);
      return { message: `Usuario borrado con éxito (id_usuario = ${idUsuario})`, result };
    }
  } catch (err) {
    console.error('Error al intentar borrar un usuario:', err);
  } 
  
  // 1️⃣Modificado para uso de pool, se cierra sola ahora?
    await pool.end();
}

async function modificarUsuarioPorId(idUsuario, datos) {
  //1️⃣ Comentada para usar pool
  //let conexion;

  try {
    // Creo la conexión
    /* 1️⃣ Comentada para usar pool
    conexion = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    */

    // Defino el string de consulta
    const sqlQuery = 'UPDATE usuarios SET documento = ?, apellido = ?, nombres = ?, email = ?, contrasenia = ?, foto_path = ?, rol = ?, activo = ? WHERE id_usuario = ?';

    // Ejecuto la consulta
    // 1️⃣Modificada para uso de pool
    const [result] = await pool.query(sqlQuery, [`${datos.documento}`, `${datos.apellido}`, `${datos.nombres}`, `${datos.email}`, `${datos.contrasenia}`, `${datos.foto_path}`, `${datos.rol}`, `${datos.activo}`, idUsuario]);

    if (result.affectedRows === 0) {
      console.log(`No se encontró un usuario con id_usuario = ${idUsuario}`);
      return { error: `No se encontró un usuario con id_usuario = ${idUsuario}` };
    } else {
      console.log('Query results:', result);
      return { message: `Usuario modificado con éxito (id_usuario = ${idUsuario})`, result };
    }
  } catch (err) {
    console.error('Error al intentar modificar datos de usuario:', err);
  } 
  
  // 1️⃣Modificado para uso de pool, se cierra sola ahora?
    await pool.end();
}

async function modificarCorreoUsuarioPorId(idUsuario, correo) {
  //1️⃣ Comentada para usar pool
  //let conexion;

  try {
    // Creo la conexión
    /* 1️⃣ Comentada para usar pool
    conexion = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    */

    // Defino el string de consulta
    const sqlQuery = 'UPDATE usuarios SET email = ? WHERE id_usuario = ?';

    // Ejecuto la consulta
    // 1️⃣Modificada para uso de pool
    const [result] = await pool.query(sqlQuery, [`${correo}`, idUsuario]);

    if (result.affectedRows === 0) {
      console.log(`No se encontró un usuario con id_usuario = ${idUsuario}`);
      return { error: `No se encontró un usuario con id_usuario = ${idUsuario}` };
    } else {
      console.log('Query results:', result);
      return { message: `Correo de usuario modificado con éxito (id_usuario = ${idUsuario}),
      (nuevo correo = ${correo})`, result };
    }
  } catch (err) {
    console.error('Error al intentar modificar datos de usuario:', err);
  } 
  
  // 1️⃣Modificado para uso de pool, se cierra sola ahora?
    await pool.end();
}

//Esta función se puede no exportar y eliminar la ruta
//Quedaría para uso interno de cambiarEstadoUsuarioById
// pero la dejo por ahora para probarla desde la ruta
async function estadoUsuarioById(idUsuario) {
  let conexion;

  try {
    // Creo la conexión
    conexion = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Defino el string de consulta
    const sqlQuery = 'SELECT activo FROM usuarios WHERE id_usuario = ?';

    // Ejecuto la consulta
    const [rows] = await conexion.query(sqlQuery, [idUsuario]);

    if (rows.length === 0) {
      console.log(`No se encontró un usuario con id_usuario = ${idUsuario}`);
      return { error: `No se encontró un usuario con id_usuario = ${idUsuario}` };
    } else {
      console.log('Query results:', rows[0].activo);
      return (rows[0].activo);
    }
  } catch (err) {
    console.error('Error executing SELECT query:', err);
  } finally {
    if (conexion) {
      await conexion.end();
    }
  }
   
}

async function cambiarEstadoUsuarioById(idUsuario) {
  const estadoActual = await estadoUsuarioById(idUsuario);
  const nuevoEstado = estadoActual === 1 ? 0 : 1;
  
  let conexion;

  try {
    // Creo la conexión
    conexion = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Defino el string de consulta
    const sqlQuery = 'UPDATE usuarios SET activo = ? WHERE id_usuario = ?';

    // Ejecuto la consulta
    const [result] = await conexion.query(sqlQuery, [nuevoEstado, idUsuario]);

    if (result.affectedRows === 0) {
      console.log(`No se encontró un usuario con id_usuario = ${idUsuario}`);
      return { error: `No se encontró un usuario con id_usuario = ${idUsuario}` };
    } else {
      console.log('Query results:', result);
      return { message: `Estado de usuario modificado con éxito (id_usuario = ${idUsuario})`, result };
    }
  } catch (err) {
    console.error('Error executing UPDATE query:', err);
  } finally {
    if (conexion) {
      await conexion.end();
    }
  }
   
}

export { getAllUsuarios, getUsuarioById, getUsuariosByApellido,
   agregarUnUsuario, borrarUsuarioPorId, modificarUsuarioPorId,
    modificarCorreoUsuarioPorId, estadoUsuarioById, cambiarEstadoUsuarioById };

//getAllUsuarios();
//getUsuarioById(1);
//getUsuariosByApellido('ben');