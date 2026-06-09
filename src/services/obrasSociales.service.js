import obrasSocialesRepository from "../repositories/obrasSociales.repository.js";

const getAll = () => obrasSocialesRepository.getAll();

const getById = (id) => obrasSocialesRepository.getById(id);

const create = (data) => obrasSocialesRepository.create(data);

const update = (id, data) => obrasSocialesRepository.update(id, data);

const remove = (id) => obrasSocialesRepository.softDelete(id);

export default {
  getAll,
  getById,
  create,
  update,
  remove
};