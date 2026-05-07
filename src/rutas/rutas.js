//👁️‍🗨️ En este archivo solo quedaron dos rutas de pruebas obsoletas
//👣 Las otras (válidas) fueron a rutas_usuarios.js

//Importamos consultas
/*
import {getAllUsuarios, getUsuarioById, getUsuariosByApellido,
     agregarUnUsuario, borrarUsuarioPorId,
      modificarUsuarioPorId, modificarCorreoUsuarioPorId,
       estadoUsuarioById, cambiarEstadoUsuarioById, agregarUnUsuarioPaciente,
        agregarUnUsuarioMedico} from '../db/consultas/usuarios_consultas.js';
*/

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

/*
router.delete('/usuarios/:id', controladoresUsuarios.borrarUsuario);
router.put('/usuarios/:id', controladoresUsuarios.modificarUsuario);

router.get('/usuarios/apellido/:apellido', controladoresUsuarios.obtenerUsuariosPorApellido);
router.get('/usuarios/estado/:id', controladoresUsuarios.estadoUsuario);
router.patch('/usuarios/estado/:id', controladoresUsuarios.cambiarEstadoUsuario);
router.post('/usuarios/paciente', controladoresUsuarios.agregarUnUsuarioPaciente);
router.post('/usuarios/medico', controladoresUsuarios.agregarUnUsuarioMedico);
*/
router.delete('/usuarios/:id', (req, res) => {
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

router.put('/usuarios/:id', (req, res) => {
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

router.patch('/usuarios/:id', (req, res) => {
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

router.get('/usuarios/apellido/:apellido', (req, res) => {
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
      

//Esta ruta (O controlador?) se podría sacar
//Prueba la función que retorna estado actual de un usuario
//Sirve para probar resultado de estadoUsuarioById
router.get('/usuarios/estado/:id', (req, res) => {
    const { id } = req.params;
    estadoUsuarioById(id)
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

router.patch('/usuarios/estado/:id', (req, res) => {
    const { id } = req.params;
    cambiarEstadoUsuarioById(id)
        .then(resultado => {
            if (resultado.error) {
                res.status(404).json(resultado);
            } else {
                res.json(resultado);
            }
        })
        .catch(err => {
            console.error('Error de servidor al modificar estado de usuario:', err);
            res.status(500).json({ error: 'Error de servidor al modificar estado de usuario' });
        });
});

//Mejorar respuestas
router.post('/usuarios/paciente', (req, res) => {
    agregarUnUsuarioPaciente(req.body)
        .then(result => {
            // ⚠️ Aunque no funcione Bruno da 201
            res.status(201).json(result);
        })
        .catch(err => {
            console.error('Error de servidor al crear usuario:', err);
            res.status(500).json({ error: 'Error de servidor al crear usuario' });
        });
});

//Mejorar respuestas
router.post('/usuarios/medico', (req, res) => {
    agregarUnUsuarioMedico(req.body)
        .then(result => {
            // ⚠️ Aunque no funcione Bruno da 201
            res.status(201).json(result);
        })
        .catch(err => {
            console.error('Error de servidor al crear usuario:', err);
            res.status(500).json({ error: 'Error de servidor al crear usuario' });
        });
});

export default router;

