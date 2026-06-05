import especialidadesService from "../services/especialidades.service.js";

// Obtener todas las especialidades
const getAll = async (req, res) => {
  try {
    const data = await especialidadesService.getAll();

    res.status(200).json({
      estado: true,
      especialidades: data
    });

  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener especialidades"
    });
  }
};

// Obtener especialidad por ID
const getById = async (req, res) => {
  try {
    const data = await especialidadesService.getById(req.params.id);

    if (!data) {
      return res.status(404).json({
        estado: false,
        mensaje: "Especialidad no encontrada"
      });
    }

    res.status(200).json({
      estado: true,
      especialidad: data
    });

  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener especialidad"
    });
  }
};

// Crear especialidad
const create = async (req, res) => {
  try {
    const result = await especialidadesService.create(req.body);

    res.status(201).json({
      estado: true,
      mensaje: "Especialidad creada",
      data: result
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      estado: false,
      mensaje: error.message || "Error al crear especialidad"
    });
  }
};

// Actualizar especialidad
const update = async (req, res) => {
  try {

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        estado: false,
        mensaje: "No hay campos para actualizar"
      });
    }

    const result = await especialidadesService.update(
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
      mensaje: error.message || "Error al actualizar especialidad"
    });
  }
};

// Eliminar especialidad (soft delete)
const remove = async (req, res) => {
  try {

    const result = await especialidadesService.remove(
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
      mensaje: error.message || "Error al eliminar especialidad"
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