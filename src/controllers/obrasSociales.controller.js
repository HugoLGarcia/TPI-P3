import obrasSocialesService from "../services/obrasSociales.service.js";

// Obtener todas
const getAll = async (req, res) => {
  try {

    const data = await obrasSocialesService.getAll();

    res.status(200).json({
      estado: true,
      obrasSociales: data
    });

  } catch (error) {

    res.status(500).json({
      estado: false,
      mensaje: error.message
    });

  }
};

// Obtener por ID
const getById = async (req, res) => {
  try {

    const data = await obrasSocialesService.getById(req.params.id);

    if (!data) {
      return res.status(404).json({
        estado: false,
        mensaje: "Obra social no encontrada"
      });
    }

    res.status(200).json({
      estado: true,
      obraSocial: data
    });

  } catch (error) {

    res.status(500).json({
      estado: false,
      mensaje: error.message
    });

  }
};

// Crear
const create = async (req, res) => {
  try {

    const result = await obrasSocialesService.create(req.body);

    res.status(201).json({
      estado: true,
      mensaje: "Obra social creada",
      data: result
    });

  } catch (error) {

    res.status(500).json({
      estado: false,
      mensaje: error.message
    });

  }
};

// Actualizar
const update = async (req, res) => {
  try {

    const result = await obrasSocialesService.update(
      req.params.id,
      req.body
    );

    res.status(200).json({
      estado: true,
      data: result
    });

  } catch (error) {

    res.status(500).json({
      estado: false,
      mensaje: error.message
    });

  }
};

// Eliminar (soft delete)
const remove = async (req, res) => {
  try {

    const result = await obrasSocialesService.remove(req.params.id);

    res.status(200).json({
      estado: true,
      data: result
    });

  } catch (error) {

    res.status(500).json({
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
  remove
};