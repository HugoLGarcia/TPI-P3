import especialidadesRepository from "../repositories/especialidades.repository.js";

const getAll = () => especialidadesRepository.getAll();

const getById = (id) => especialidadesRepository.getById(id);

const create = (data) => especialidadesRepository.create(data);

const update = (id, data) =>
  especialidadesRepository.update(id, data);

const remove = (id) =>
  especialidadesRepository.softDelete(id);

export default {
  getAll,
  getById,
  create,
  update,
  remove
};