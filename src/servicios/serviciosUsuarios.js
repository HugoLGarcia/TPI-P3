import * as usuariosRepositorio from '../repositorios/repositorioUsuarios.js';

import { createHash } from 'node:crypto';

const obtenerTodos = () => usuariosRepositorio.obtenerTodos();

const obtenerPorId = (id) => usuariosRepositorio.obtenerPorId(id);

const agregarUnUsuario = (datos) => {
    const newContrasenia = createHash('sha256')
        .update(datos.contrasenia)
        .digest('hex');
    return usuariosRepositorio.agregarUnUsuario({ ...datos, contrasenia: newContrasenia });
};

const modificarEstadoUsuarioId = (id) => usuariosRepositorio.modificarEstadoUsuarioId(id);

const modificarCorreoUsuario = (id, email) => usuariosRepositorio.modificarCorreoUsuario(id, email);

const registrarUsuarioGenerico = (datos) => usuariosRepositorio.registrarUsuarioGenerico(datos);

export {
    obtenerTodos,
    obtenerPorId,
    agregarUnUsuario,
    modificarEstadoUsuarioId,
    modificarCorreoUsuario,
    registrarUsuarioGenerico
};