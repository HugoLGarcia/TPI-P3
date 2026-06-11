import medicosRepository from "../repositories/medicos.repository.js";

const getAll = () => medicosRepository.getAll();

const create = async (data) => {
  return await medicosRepository.create(data);
};

const getById = (id) => medicosRepository.getById(id);

const asociarObrasSociales = async (id_medico, obras_sociales) => {
  return await medicosRepository.asociarObrasSociales(
    id_medico,
    obras_sociales
  );
};

export default {
  getAll,
  getById,
  asociarObrasSociales,
  create
};