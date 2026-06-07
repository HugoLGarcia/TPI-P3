import usuariosService from "../../services/v0/usuarios.service.js";

// Obtener todos los usuarios
const getAll = async (req, res) => {
  try {
    const data = await usuariosService.getAll();

    res.status(200).json({
      estado: true,
      usuarios: data
    });

  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener usuarios"
    });
  }
};

// Obtener usuario por ID
const getById = async (req, res) => {
  try {
    const data = await usuariosService.getById(req.params.id);

    if (!data) {
      return res.status(404).json({
        estado: false,
        mensaje: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      estado: true,
      usuario: data
    });

  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener usuario"
    });
  }
};

// Crear usuario
const create = async (req, res) => {
  try {
    const result = await usuariosService.create(req.body);

    res.status(201).json({
      estado: true,
      mensaje: "Usuario creado",
      data: result
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      estado: false,
      mensaje: "Error al crear usuario"
    });
  }
};

// Actualizar usuario
const update = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        estado: false,
        mensaje: "No hay campos para actualizar"
      });
    }

    const result = await usuariosService.update(req.params.id, req.body);

    res.status(200).json({
      estado: true,
      data: result
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      estado: false,
      mensaje: "Error al actualizar usuario"
    });
  }
};

// Eliminar usuario
const remove = async (req, res) => {
  try {
    const result = await usuariosService.remove(req.params.id);

    res.status(200).json({
      estado: true,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al eliminar usuario"
    });
  }
};

// Buscar usuarios por apellido o nombre
const search = async (req, res) => {
  try {
    const { texto } = req.query;

    if (!texto) {
      return res.status(400).json({
        error: "Debe ingresar un texto de búsqueda"
      });
    }

    const data = await usuariosService.search(texto);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar usuarios" });
  }
};


// Modificar estado de usuario por ID
const changeStateId = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await usuariosService.changeStateId(id);
        if (resultado.error) {
            res.status(400).json(resultado);
        } else {
            res.status(201).json(resultado);
        }
    } catch (error) {
        res.status(500).json({ error: "Error de servidor al modificar estado de usuario" });
    } 
};

// Modificar correo de usuario por ID
const changeEmailId = async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;
    try {
        const usuario = await usuariosService.changeEmailId(id, email);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error de servidor al modificar correo de usuario" });
    }
};

// Registra usuario genérico, médico o paciente, dependiendo de los datos enviados
const registerGeneric = async (req, res) => {
    const datos = req.body;
    try {
        const resultado = await usuariosService.registerGeneric(datos);
        if (resultado.error) {
            res.status(400).json(resultado);
        } else {
            res.status(201).json(resultado);
        }
    } catch (error) {
        res.status(500).json({ error: "Error de servidor al registrar usuario genérico", sqlMessage: error.sqlMessage });
    } 
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  search,
  changeStateId,
  changeEmailId,
  registerGeneric
};