import pacientesRepository from "../repositories/pacientes.repository.js";

const getAll = () => pacientesRepository.getAll();

const getById = (id) => pacientesRepository.getById(id);

const create = (data) =>
  pacientesRepository.create(data.id_usuario, data.id_obra_social);

const updateObraSocial = (idPaciente, idObraSocial) =>
  pacientesRepository.updateObraSocial(idPaciente, idObraSocial);

export default {
  getAll,
  getById,
  updateObraSocial,
  create
};