import express from 'express';

//Importamos la función para testeo de conexión a bd
import { testConexion } from './db/conexion/test-conexion.js';

//Importamos consultas
import {getAllUsuarios, getUsuarioById, getUsuariosByApellido,
     agregarUnUsuario, borrarUsuarioPorId,
      modificarUsuarioPorId, modificarCorreoUsuarioPorId} from './db/consultas/usuarios_consultas.js';

const app = express();

const port = process.env.Puerto || 3000;

// TEST BASE DE DATOS
//⚠️ Tal cual al tp
await testConexion();

app.use(express.json());


//Rutas
app.get('/', (req, res) => {
    /*
    res.type('text/plain');
    res.status(200);
    res.send('Hola soy una app Express para tus turnos!!');
    */
    //Respuesta con HTML
    res.type('text/html');
    res.status(200);
    res.send(`<html>
    <head></head>
    <body><h1>🏠 Hola soy una app Express!!!!!</h1>
    <h2>🏥 Voy a gestionar la clínica!!! 🏥</h2>
    <ul>
        <li><a href="/">Inicio</a></li>
        <li><a href="/usuarios">Usuarios</a></li>
        <li><a href="/contacto">Contacto</a></li>
    </ul>
    </body>
    </html>`);
    
});

app.get('/institucional', (req, res) => {
    res.type('text/plain');
    res.status(200);
    res.send('🏢 Institucional');
});


app.get('/usuarios', (req, res) => {
    getAllUsuarios()
        .then(usuarios => {
            res.json(usuarios);
        })
        .catch(err => {
            console.error('Error de servidor al buscar usuarios:', err);
            res.status(500).json({ error: 'Error de servidor al buscar usuarios' });
        });
});

app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    getUsuarioById(id)
        .then(usuario => {
            if (usuario.error) {
                res.status(404).json(usuario);
            } else {
                res.json(usuario);
            }
        })
        .catch(err => {
            console.error('Error de servidor al buscar usuario:', err);
            res.status(500).json({ error: 'Error de servidor al buscar usuario' });
        });
});

app.get('/usuariosapellido/:apellido', (req, res) => {
    const { apellido } = req.params;
    getUsuariosByApellido(apellido)
        .then(usuarios => {
            if (usuarios.error) {
                if (usuarios.error.includes('al menos 3 caracteres')) {
                    res.status(400).json(usuarios);
                }
                res.status(404).json(usuarios);
            }

            res.json(usuarios);
        })
        .catch(err => {
            console.error('Error de servidor al buscar usuario:', err);
            res.status(500).json({ error: 'Error de servidor al buscar usuario' });
        });
});
      
app.post('/usuarios', (req, res) => {
    agregarUnUsuario(req.body)
        .then(result => {
            // ⚠️ Aunque no funcione Bruno da 201
            res.status(201).json(result);
        })
        .catch(err => {
            console.error('Error de servidor al crear usuario:', err);
            res.status(500).json({ error: 'Error de servidor al crear usuario' });
        });
});

app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    borrarUsuarioPorId(id)
        .then(resultado => {
            if (resultado.error) {
                res.status(404).json(resultado);
            } else {
                res.json(resultado);
            }
        })
        .catch(err => {
            console.error('Error de servidor al borrar usuario:', err);
            res.status(500).json({ error: 'Error de servidor al borrar usuario' });
        });
});

app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    modificarUsuarioPorId(id, req.body)
        .then(resultado => {
            if (resultado.error) {
                res.status(404).json(resultado);
            } else {
                res.json(resultado);
            }
        })
        .catch(err => {
            console.error('Error de servidor al modificar usuario:', err);
            res.status(500).json({ error: 'Error de servidor al modificar usuario' });
        });
});

app.patch('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    modificarCorreoUsuarioPorId(id, req.body.email)
        .then(resultado => {
            if (resultado.error) {
                res.status(404).json(resultado);
            } else {
                res.json(resultado);
            }
        })
        .catch(err => {
            console.error('Error de servidor al modificar correo de usuario:', err);
            res.status(500).json({ error: 'Error de servidor al modificar correo de usuario' });
        });
});

app.listen(port, () => console.log(`Servidor iniciado en el puerto ${port}`))
