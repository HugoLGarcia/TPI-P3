//Uso dotenv para levantar el archivo de configuración .env
import dotenv from 'dotenv';
//Uso mysql2/promise para conectarme a MySQL usando promises
import mysql from 'mysql2/promise';
dotenv.config();

async function getAllUsuarios() {
  try {
    // Creo la conexión
    const conexion = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Defino el string de consulta
    const sqlQuery = 'SELECT * FROM usuarios';

    // Ejecuto la consulta
    const [rows] = await conexion.query(sqlQuery);

    console.log('Query results:', rows);

    await conexion.end();

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
    } else {
      console.log('Query results:', rows[0]);
      return rows.length > 0 ? rows[0] : { error: `No se encontró un usuario con id_usuario = ${idUsuario}` };
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
    return;
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

export {getAllUsuarios, getUsuarioById, getUsuariosByApellido};

//getAllUsuarios();
//getUsuarioById(1);
//getUsuariosByApellido('ben');