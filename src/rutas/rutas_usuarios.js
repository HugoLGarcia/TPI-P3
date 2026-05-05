//🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔
//Creo que lo que quedó en cada una de estas se puede separar en 
// 📁controladores, 📁servicios y 📁repositorio (que serían nuestras 
// consultas en db)
// y no sé dónde irían además los 📁meedlewares que correspondan
//🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔

import { Router } from 'express';
import { getAllUsuarios, getUsuarioById, agregarUnUsuario,
     borrarUsuarioPorId, modificarUsuarioPorId,
      modificarCorreoUsuarioPorId, getUsuariosByApellido,
       estadoUsuarioById, cambiarEstadoUsuarioById, agregarUnUsuarioMedico,
        agregarUnUsuarioPaciente, registrarUsuarioGenerico } from '../db/consultas/usuarios_consultas.js';

const router = Router();


// Rutas para usuarios
router.get('/usuarios', (req, res) => {
    getAllUsuarios()
        .then(usuarios => {
            res.json(usuarios);
        })
        .catch(err => {
            console.error('Error de servidor al buscar usuarios:', err);
            res.status(500).json({ error: 'Error de servidor al buscar usuarios' });
        });
});

router.get('/usuarios/:id', (req, res) => {
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

router.post('/usuarios', (req, res) => {
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

//Mejorar respuestas
router.post('/usuarios/generico', (req, res) => {
    registrarUsuarioGenerico(req.body)
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