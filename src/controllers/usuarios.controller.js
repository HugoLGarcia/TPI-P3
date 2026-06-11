import usuariosService from "../services/usuarios.service.js";

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

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        estado: false,
        mensaje: "Ya existe un usuario con ese documento o email"
      });
    }

    res.status(500).json({
      estado: false,
      mensaje: error.message
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

    if (error.message === "Usuario no encontrado o inactivo") {
      return res.status(404).json({
        estado: false,
        mensaje: error.message
      });
    }

    res.status(500).json({
      estado: false,
      mensaje: error.message
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

    console.error(error);

    if (error.message === "Usuario no encontrado o ya eliminado") {
      return res.status(404).json({
        estado: false,
        mensaje: error.message
      });
    }

    res.status(500).json({
      estado: false,
      mensaje: error.message
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


// Actualizar foto de usuario
const updateFoto = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        estado: false,
        mensaje: "Debe seleccionar una imagen"
      });
    }

    const fotoPath = req.file.path.replaceAll("\\", "/");

    await usuariosService.updateFoto(
      req.params.id,
      fotoPath
    );

    return res.status(200).json({
      estado: true,
      mensaje: "Foto actualizada",
      foto_path: fotoPath
    });

  } catch (error) {

    return res.status(500).json({
      estado: false,
      mensaje: error.message
    });

  }
};



export default {
  getAll,
  getById,
  create,
  update,
  remove,
  search,
  updateFoto
};