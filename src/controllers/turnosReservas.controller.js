import turnosReservasService from "../services/turnosReservas.service.js";

const create = async (req, res) => {

  try {

    const turnoReserva = req.body;

    const nuevoTurno = await turnosReservasService.create(
  turnoReserva,
  req.user
);

    if (!nuevoTurno) {

      return res.status(400).json({
        estado: false,
        mensaje: "No se pudo crear el turno"
      });

    }

    return res.status(201).json({
      estado: true,
      mensaje: "Turno creado",
      datos: nuevoTurno
    });

  } catch (error) {

    console.error(`Error POST /turnos-reservas`, error);

    return res.status(400).json({
      estado: false,
      mensaje: error.message
    });

  }

};

const getAll = async (req, res) => {

  try {

    const turnos = await turnosReservasService.getAll(
      req.user
    );

    return res.status(200).json({
      estado: true,
      mensaje: "Turnos encontrados",
      turnos
    });

  } catch (error) {

    console.error(`Error GET /turnos-reservas`, error);

    return res.status(500).json({
      estado: false,
      mensaje: "Error interno"
    });

  }

};

const marcarAtendido = async (req, res) => {

  try {

    await turnosReservasService.marcarAtendido(
      req.params.id,
      req.user.id_usuario
    );

    return res.status(200).json({
      estado: true,
      mensaje: "Turno marcado como atendido"
    });

  } catch (error) {

    return res.status(400).json({
      estado: false,
      mensaje: error.message
    });

  }

};

export default {
  create,
  getAll,
  marcarAtendido
};