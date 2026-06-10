import pacientesRepository from "../repositories/pacientes.repository.js";

const getAll = () => pacientesRepository.getAll();

const getById = (id) => pacientesRepository.getById(id);

const updateObraSocial = (idPaciente, idObraSocial) =>
  pacientesRepository.updateObraSocial(idPaciente, idObraSocial);

export default {
  getAll,
  getById,
  updateObraSocial
};