import usuariosService from "../services/usuarios.service.js";

// Obtener todos los usuarios
const getAll = async (req, res) => {
  try {
    const data = await usuariosService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Obtener usuario por ID
const getById = async (req, res) => {
  try {
    const data = await usuariosService.getById(req.params.id);

    if (!data) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// crear usuario
const create = async (req, res) => {
  try {
    const result = await usuariosService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      error: "Error al crear usuario"
    });
  }
};



/* const create = async (req, res) => {
  try {
    const { documento, apellido, nombres, email, contrasenia, rol } = req.body;

    if (!documento || !apellido || !nombres || !email || !contrasenia || !rol) {
      return res.status(400).json({
        error: "Faltan campos obligatorios"
      });
    }

    const result = await usuariosService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      error: "Error al crear usuario"
    });
  }
}; */

// Actualizar usuario
const update = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    const result = await usuariosService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    if (error.message === "Usuario no encontrado o inactivo") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// Eliminar usuario
const remove = async (req, res) => {
  try {
    const result = await usuariosService.remove(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === "Usuario no encontrado o ya eliminado") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Error al eliminar usuario" });
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

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  search
};