import medicosRepository from "../repositories/medicos.repository.js";

const getAll = () => medicosRepository.getAll();

const getById = (id) => medicosRepository.getById(id);

const create = async (data) => {
  return await medicosRepository.create(data);
};

const asociarObrasSociales = async (id_medico, obras_sociales) => {
  return await medicosRepository.asociarObrasSociales(
    id_medico,
    obras_sociales,
  );
};
// Obtener médicos por especialidad
const getByEspecialidad = (idEspecialidad) =>
  medicosRepository.getByEspecialidad(idEspecialidad);

export default {
  getAll,
  getById,
  asociarObrasSociales,
  create,
  getByEspecialidad,
};
