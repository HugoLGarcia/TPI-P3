import obrassocialesRepository from "../repositories/obrassociales.repository.js";

const getAll = () => obrassocialesRepository.getAll();

const getById = (id) => obrassocialesRepository.getById(id);

const create = (data) => obrassocialesRepository.create(data);

const update = (id, data) =>
  obrassocialesRepository.update(id, data);

const remove = (id) =>
  obrassocialesRepository.softDelete(id);

export default {
  getAll,
  getById,
  create,
  update,
  remove
};