import turnosService from "../services/turnos.service.js";

const create = async (req, res) => {
  try {
    const result = await turnosService.create(req.body);

    res.status(201).json({
      estado: true,
      mensaje: "Turno creado",
      data: result
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      estado: false,
      mensaje: error.message || "Error al crear turno"
    });
  }
};

export default {
  create
};
