//no sé dónde irían además los 📁meedlewares que correspondan
//🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔

import { Router } from 'express';

import * as controladoresUsuarios from '../controladores/controladoresUsuarios.js';
import {validarCorreoMiddleware} from '../middlewares/validacionesUsuarios.js';

const router = Router();

// Rutas para usuarios
router.get('/usuarios', controladoresUsuarios.obtenerTodos);
router.get('/usuarios/:id', controladoresUsuarios.obtenerPorId);
router.post('/usuarios', controladoresUsuarios.agregarUnUsuario);
router.delete('/usuarios/:id', controladoresUsuarios.modificarEstadoUsuarioId);
router.patch('/usuarios/:id', validarCorreoMiddleware, controladoresUsuarios.modificarCorreoUsuario);
router.post('/usuarios/generico', controladoresUsuarios.registrarUsuarioGenerico);

export default router;
