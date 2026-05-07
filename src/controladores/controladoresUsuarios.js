import * as serviciosUsuarios from "../servicios/serviciosUsuarios.js";

const obtenerTodos = async (req, res) => {
    try {
    const usuarios = await serviciosUsuarios.obtenerTodos();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error de servidoral obtener usuarios" });
  }
};

const obtenerPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await serviciosUsuarios.obtenerPorId(id);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error de servidor al obtener usuario" });
    }
};

const agregarUnUsuario = async (req, res) => {
    const datos = req.body;
    try {
        const resultado = await serviciosUsuarios.agregarUnUsuario(datos);
        if (resultado.error) {
            res.status(400).json(resultado);
        } else {
            res.status(201).json(resultado);
        }
    } catch (error) {
        res.status(500).json({ error: "Error de servidor al agregar usuario" });
    } 
};

const modificarEstadoUsuarioId = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await serviciosUsuarios.modificarEstadoUsuarioId(id);
        if (resultado.error) {
            res.status(400).json(resultado);
        } else {
            res.status(201).json(resultado);
        }
    } catch (error) {
        res.status(500).json({ error: "Error de servidor al modificar estado de usuario" });
    } 
};

const modificarCorreoUsuario = async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;
    try {
        const usuario = await serviciosUsuarios.modificarCorreoUsuario(id, email);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error de servidor al modificar correo de usuario" });
    }
};

const registrarUsuarioGenerico = async (req, res) => {
    const datos = req.body;
    try {
        const resultado = await serviciosUsuarios.registrarUsuarioGenerico(datos);
        if (resultado.error) {
            res.status(400).json(resultado);
        } else {
            res.status(201).json(resultado);
        }
    } catch (error) {
        res.status(500).json({ error: "Error de servidor al registrar usuario genérico" });
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
