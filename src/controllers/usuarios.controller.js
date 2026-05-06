import usuariosService from "../services/usuarios.service.js";

const getAll = async (req, res) => {
  try {
    const data = await usuariosService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

const getById = async (req, res) => {
  try {
    const data = await usuariosService.getById(req.params.id);

    if (!data) return res.status(404).json({ error: "No encontrado" });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

const create = async (req, res) => {
  try {
    const result = await usuariosService.create(req.body);
    res.status(201).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al crear usuario"
    });
  }
};

const update = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    const result = await usuariosService.update(req.params.id, req.body);
    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

const remove = async (req, res) => {
  try {
    const result = await usuariosService.remove(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove
};