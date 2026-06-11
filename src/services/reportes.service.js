import reportesRepository from "../repositories/reportes.repository.js";

const getTurnosParaPdf = async () => {
  return await reportesRepository.getTurnosParaPdf();
};

export default {
  getTurnosParaPdf,
};
