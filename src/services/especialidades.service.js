import especialidadesRepository from "../repositories/especialidades.repository.js";
import apicache from "apicache";

const cache = apicache.middleware;

const getAll = () => especialidadesRepository.getAll();

const getById = (id) => especialidadesRepository.getById(id);

const create = async (data) => {
  apicache.clear(); // Limpia cache al crear una nueva especialidad
  return await especialidadesRepository.create(data);
};

const update = async (id, data) => {
  apicache.clear(); // Limpia cache al actualizar una especialidad
  return await especialidadesRepository.update(id, data);
};

const remove = async (id) => {
  apicache.clear(); // Limpia cache al eliminar una especialidad
  return await especialidadesRepository.softDelete(id);
};

export default {
  getAll,
  getById,
  create,
  update,
  remove
};