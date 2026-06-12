import estadisticasService from "../services/estadisticas.service.js";

const getGenerales = async (req, res) => {
  try {
    const data = await estadisticasService.getGenerales();
    res.status(200).json({ estado: true, datos: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ estado: false, mensaje: "Error al obtener estadísticas generales" });
  }
};

const getPorMedico = async (req, res) => {
  try {
    const data = await estadisticasService.getPorMedico();
    res.status(200).json({ estado: true, datos: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ estado: false, mensaje: "Error al obtener estadísticas por médico" });
  }
};

const getPorObraSocial = async (req, res) => {
  try {
    const data = await estadisticasService.getPorObraSocial();
    res.status(200).json({ estado: true, datos: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ estado: false, mensaje: "Error al obtener estadísticas por obra social" });
  }
};

const getPorEspecialidad = async (req, res) => {
  try {
    const data = await estadisticasService.getPorEspecialidad();
    res.status(200).json({ estado: true, datos: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ estado: false, mensaje: "Error al obtener estadísticas por especialidad" });
  }
};

export default {
  getGenerales,
  getPorMedico,
  getPorObraSocial,
  getPorEspecialidad,
};