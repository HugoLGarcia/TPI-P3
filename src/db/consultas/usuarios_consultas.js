//⚠️⚠️⚠️⚠️⚠️
//Este archivo ya no se usa
//⚠️⚠️⚠️⚠️⚠️

//Ver lo de result.affectedRaws > 0 para mensajes de éxito o error en borrado y modificación
//Mensaje result.insertedId

//En las validaciones manuales iría express-validator
//Se implementa como meedleware, entre la petición y el controlador, para validar los datos de entrada antes de que lleguen a la función que hace la consulta a la base de datos.
//Si la validación falla, el middleware puede enviar una respuesta de error al cliente sin que el controlador se ejecute. 
//Si la validación es exitosa, el middleware llama a next() para pasar el control al siguiente middleware o al controlador.
//Se instala con npm install express-validator
//Se importa con import { body, validationResult } from 'express-validator';
//Se utiliza en la ruta como un array de middlewares, por ejemplo:
//router.post('/usuarios', [
//  body('email').isEmail().withMessage('El correo electrónico no es válido'),
//  body('contrasenia').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
//], (req, res) => {
//  const errors = validationResult(req);
//  if (!errors.isEmpty()) {
//    return res.status(400).json({ errors: errors.array() });
//  }
//  // Si la validación es exitosa, se ejecuta el controlador para agregar un usuario
//  agregarUnUsuario(req.body)
//    .then(result => {
//      res.status(201).json(result);
//    })
//    .catch(err => {
//      console.error('Error de servidor al crear usuario:', err);
//      res.status(500).json({ error: 'Error de servidor al crear usuario' });
//    });
//});

//Tambien se puede check() para validar otros campos, por ejemplo:
//body('documento').isNumeric().withMessage('El documento debe ser un número'),
//body('apellido').notEmpty().withMessage('El apellido es obligatorio'),


//❓Podría ser un .js por cada entidad
// y algún otro para consultas complejas❓
//Uso dotenv para levantar el archivo de configuración .env
//⚠️ Creo que deberíamos utilizar el método nativo "process.loadEnvFile();"
// que es el que utilizan Cristian (Pero no Ignacio)
//import dotenv from 'dotenv';
//dotenv.config();

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
       !datos.email || !datos.contrasenia || !(datos.foto_path.length >= 0) || !datos.rol || !datos.activo) {
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

//Se prueba llamar a un procedimiento almacenado
async function agregarUnUsuarioPaciente(datos) {
  try {
    // Creo la conexión
    const conexion = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // En lugar de el string de consulta llamo procedimiento
    //const sqlQuery = 'INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const sql = 'CALL cargar_Usuario_Paciente(?, ?, ?, ?, ?, ?, ?)';

    // ⚠️ Validación básica, esto debería ser un middleware?
    // ⚠️ No debería seguir si no está completo. 
    if (!datos.documento || !datos.apellido || !datos.nombres ||
       !datos.email || !datos.contrasenia || !(datos.foto_path.length >= 0) || !datos.obra_social) {
      return { error: 'Faltan campos obligatorios' };
    }

    //ℹ️ Son 7 parámetros, el último es obra_social que es específico 
    // para pacientes, el rol (2) y activo (1) se asignan en procedimiento mysql.
    const [result] = await conexion.execute(sql, [`${datos.documento}`,
       `${datos.apellido}`, `${datos.nombres}`, `${datos.email}`,
        `${datos.contrasenia}`, `${datos.foto_path}`, `${datos.obra_social}`]);

    return result;
        
    await conexion.end();

  } catch (err) {
    console.error('Error executing SELECT query:', err);
  }
}

//Se prueba llamar otro procedimiento almacenado
async function agregarUnUsuarioMedico(datos) {
  try {
    // Creo la conexión
    const conexion = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // En lugar de el string de consulta llamo procedimiento
    //const sqlQuery = 'INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const sql = 'CALL cargar_Usuario_Medico(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    // ⚠️ Validación básica, esto debería ser un middleware?
    // ⚠️ No debería seguir si no está completo. 
    if (!datos.documento || !datos.apellido || !datos.nombres ||
       !datos.email || !datos.contrasenia || !(datos.foto_path.length >= 0) ||
        !datos.especialidad || !datos.matricula || !datos.descripcion || !datos.valor_consulta) {
      return { error: 'Faltan campos obligatorios' };
    }

    //ℹ️ Son 10 parámetros, los 4 últimos son específicos 
    // para medicos, el rol (1) y activo (1) se asignan en procedimiento mysql.
    const [result] = await conexion.execute(sql, [`${datos.documento}`,
       `${datos.apellido}`, `${datos.nombres}`, `${datos.email}`,
        `${datos.contrasenia}`, `${datos.foto_path}`, `${datos.especialidad}`,
         `${datos.matricula}`, `${datos.descripcion}`, `${datos.valor_consulta}`]);

    return result;
        
    await conexion.end();

  } catch (err) {
    console.error('Error executing SELECT query:', err);
  }
}

/*

👁️👁️👁️👁️Transacción para crear un paciente a probar

const registrarPaciente = async (datos) => {
  const { documento, apellido, nombres, email, contrasenia, foto_path, id_obrasocial } = datos;

  // El bloque de SQL que definimos antes
  const sql = `
    START TRANSACTION;

    INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo)
    VALUES (?, ?, ?, ?, ?, ?, 2, 1);

    SET @v_id_usuario = LAST_INSERT_ID();

    INSERT INTO pacientes (id_usuario, id_obra_social)
    VALUES (@v_id_usuario, ?);

    COMMIT;
  `;

  const params = [documento, apellido, nombres, email, contrasenia, foto_path, id_obrasocial];

  try {
    // Ejecutamos la transacción completa
    // Nota: Usamos .promise() si usás mysql2, o el método que tu driver use para promesas
    await db.query(sql, params);
    
    return { success: true, message: "Paciente registrado correctamente" };

  } catch (error) {
    // Si algo falló en cualquier punto del string SQL, venimos acá
    console.error("Error detectado, revirtiendo cambios...");
    
    // Ejecutamos el ROLLBACK para asegurar la integridad
    await db.query("ROLLBACK;");
    
    throw error; // Re-lanzamos el error para manejarlo en el controlador (res.status(500))
  }
};
*/



//👁️👁️👁️👁️Transacción para crear paciente o médico según rol a probar

//👁️👁️👁️👁️Transacción para crear paciente o médico según rol a probar

const registrarUsuarioGenerico = async (datos) => {
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

} catch (error) {
    await connection.rollback(); // Si algo falló, deshacemos TODO
    console.error("Error, se hizo rollback:", error);
    throw error;
} finally {
    connection.release(); // IMPORTANTE: Devolver la conexión al pool
}
  
};

const registrarUsuarioGenericoNoVa = async (datos) => {
  const { documento, apellido, nombres, email, contrasenia, foto_path, rol } = datos;

  // 1. Iniciamos la base de la query y los parámetros comunes
  let sql = 'START TRANSACTION; ' +
    'INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?, 1); ' +
    'SET @v_id_usuario = LAST_INSERT_ID(); ';

  let params = [documento, apellido, nombres, email, contrasenia, foto_path, rol];

  // 2. Agregamos lógica específica según el rol
  if (rol === 1) { 
    // Ejemplo Médico: requiere especialidad, matrícula, descripción y valor de consulta
    sql += `INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) VALUES (@v_id_usuario, ?, ?, ?, ?);`;
    params.push(datos.especialidad, datos.matricula, datos.descripcion, datos.valor_consulta);
    
  } else if (rol === 2) {
    // Ejemplo Paciente: requiere solo obra social
    sql += `INSERT INTO pacientes (id_usuario, id_obra_social) VALUES (@v_id_usuario, ?);`;
    params.push(datos.id_obra_social);
  }

  // 3. Cerramos la transacción
  sql += ` COMMIT;`;

  try {
    await pool.query(sql, params);
    return { success: true };
  } catch (error) {
    await pool.query("ROLLBACK;");
    console.error("Error en transacción:", error.message);
    throw error;
  }
};


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
    modificarCorreoUsuarioPorId, estadoUsuarioById,
    cambiarEstadoUsuarioById, agregarUnUsuarioPaciente, 
    agregarUnUsuarioMedico, registrarUsuarioGenerico };

//getAllUsuarios();
//getUsuarioById(1);
//getUsuariosByApellido('ben');