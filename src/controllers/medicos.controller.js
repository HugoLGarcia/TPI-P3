import medicosService from "../services/medicos.service.js";

const getAll = async (req, res) => {
  try {

    const medicos = await medicosService.getAll();

    res.json({
      estado: true,
      datos: medicos
    });

  } catch (error) {

    res.status(500).json({
      estado: false,
      mensaje: "Error interno"
    });

  }
};

const create = async (req, res) => {
  try {
    const result = await medicosService.create(req.body);

    res.status(201).json({
      estado: true,
      mensaje: "Médico creado correctamente",
      data: result
    });

  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: error.message
    });
  }
};

const getById = async (req, res) => {
  try {

    const medico = await medicosService.getById(
      req.params.id
    );

    if (!medico) {
      return res.status(404).json({
        estado: false,
        mensaje: "Médico no encontrado"
      });
    }

    res.json({
      estado: true,
      datos: medico
    });

  } catch (error) {

    res.status(500).json({
      estado: false,
      mensaje: "Error interno"
    });

  }
};

const asociarObrasSociales = async (req, res) => {
  try {

    const { id } = req.params;
    const { obras_sociales } = req.body;

    await medicosService.asociarObrasSociales(
      id,
      obras_sociales
    );

    res.status(201).json({
      estado: true,
      mensaje: "Obras sociales asociadas correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(400).json({
      estado: false,
      mensaje: error.message
    });

  }
};

export default {
  getAll,
  getById,
  asociarObrasSociales,
  create
};