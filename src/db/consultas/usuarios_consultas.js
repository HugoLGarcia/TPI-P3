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
    //1️⃣Modificado para uso de pool, se cierra sola ahora?
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
    if (!datos.documento || !datos.nombres || !datos.email 
      || !datos.contrasenia || !datos.foto_path || !datos.rol 
      || !datos.activo) {
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

export {getAllUsuarios, getUsuarioById, getUsuariosByApellido, agregarUnUsuario};

//getAllUsuarios();
//getUsuarioById(1);
//getUsuariosByApellido('ben');