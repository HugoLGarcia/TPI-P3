import estadisticasRepository from "../repositories/estadisticas.repository.js";

const getGenerales     = () => estadisticasRepository.getGenerales();
const getPorMedico     = () => estadisticasRepository.getPorMedico();
const getPorObraSocial = () => estadisticasRepository.getPorObraSocial();
const getPorEspecialidad = () => estadisticasRepository.getPorEspecialidad();

export default {
  getGenerales,
  getPorMedico,
  getPorObraSocial,
  getPorEspecialidad,
};