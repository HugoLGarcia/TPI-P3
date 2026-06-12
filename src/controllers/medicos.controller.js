import medicosService from "../services/medicos.service.js";

// Obtener todos los médicos activos
const getAll = async (req, res) => {
  try {
    const data = await medicosService.getAll();

    res.status(200).json({
      estado: true,
      medicos: data
    });

  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener listado de médicos"
    });
  }
};

// Obtener médico por ID
const getById = async (req, res) => {
  try {
    const data = await medicosService.getById(req.params.id);

    if (!data) {
      return res.status(404).json({
        estado: false,
        mensaje: "Médico no encontrado"
      });
    }

    res.status(200).json({
      estado: true,
      medico: data
    });

  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener médico"
    });
  }
};

async function asociarMedicoConObraSocial(req, res) {
    try {
        const id_medico = req.params.id_medico;
        const obras_sociales = req.body.obras_sociales;

        await medicosService.asociarMedicoConObraSocial(id_medico, obras_sociales);

        res.status(200).json({
            estado: true,
            mensaje: "Médico asociado a obra social exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            estado: false,
            mensaje: "Error al asociar médico con obra social"
        });
    }
};

/*
const asociarMedicoConEspecialidad = async (req, res) => {
    try {
        const id_medico = req.params.id_medico;
        const especialidades = req.body.especialidades;

        await medicosService.asociarMedicoConEspecialidad(id_medico, especialidades);

        res.status(200).json({
            estado: true,
            mensaje: "Médico asociado a especialidad exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            estado: false,
            mensaje: "Error al asociar médico con especialidad"
        });
    }
};
*/

export default {
  getAll,
  getById,
  asociarMedicoConObraSocial,
  //asociarMedicoConEspecialidad
};