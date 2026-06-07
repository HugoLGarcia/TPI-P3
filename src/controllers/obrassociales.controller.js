import obrassocialesService from "../services/obrassociales.service.js";

// Obtener todas las obras sociales
const getAll = async (req, res) => {
  try {
    const data = await obrassocialesService.getAll();

    res.status(200).json({
      estado: true,
      obrassociales: data
    });

  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener obras sociales"
    });
  }
};

// Obtener obra social por ID
const getById = async (req, res) => {
  try {
    const data = await obrassocialesService.getById(req.params.id);

    if (!data) {
      return res.status(404).json({
        estado: false,
        mensaje: "Obra social no encontrada"
      });
    }

    res.status(200).json({
      estado: true,
      obrassociales: data
    });

  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener obra social"
    });
  }
};

// Crear obra social
const create = async (req, res) => {
  try {
    const result = await obrassocialesService.create(req.body);

    res.status(201).json({
      estado: true,
      mensaje: "Obra social creada",
      data: result
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      estado: false,
      mensaje: error.message || "Error al crear obra social"
    });
  }
};

// Actualizar obra social
const update = async (req, res) => {
  try {

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        estado: false,
        mensaje: "No hay campos para actualizar"
      });
    }

    const result = await obrassocialesService.update(
      req.params.id,
      req.body
    );

    res.status(200).json({
      estado: true,
      data: result
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      estado: false,
      mensaje: error.message || "Error al actualizar obra social"
    });
  }
};

// Eliminar obra social (soft delete)
const remove = async (req, res) => {
  try {

    const result = await obrassocialesService.remove(
      req.params.id
    );

    res.status(200).json({
      estado: true,
      data: result
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      estado: false,
      mensaje: error.message || "Error al eliminar obra social"
    });
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove
};