import pacientesService from "../services/pacientes.service.js";

const getAll = async (req, res) => {
  try {
    const data = await pacientesService.getAll();

    res.status(200).json({
      estado: true,
      pacientes: data,
    });
  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: error.message,
    });
  }
};

const getById = async (req, res) => {
  try {
    const data = await pacientesService.getById(req.params.id);

    if (!data) {
      return res.status(404).json({
        estado: false,
        mensaje: "Paciente no encontrado",
      });
    }

    res.status(200).json({
      estado: true,
      paciente: data,
    });
  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: error.message,
    });
  }
};

const updateObraSocial = async (req, res) => {
  try {
    const result = await pacientesService.updateObraSocial(
      req.params.id,
      req.body.id_obra_social,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        estado: false,
        mensaje: "Paciente no encontrado",
      });
    }

    res.status(200).json({
      estado: true,
      mensaje: "Obra social del paciente actualizada",
    });
  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: error.message,
    });
  }
};

export default {
  getAll,
  getById,
  updateObraSocial,
};
