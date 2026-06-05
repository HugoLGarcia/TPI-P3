import usuariosRepository from "../repositories/usuarios.repository.js";
import crypto from "crypto";

const getAll = () => usuariosRepository.getAll();

const getById = (id) => usuariosRepository.getById(id);

const create = async (data) => {
  const hash = crypto
    .createHash("sha256")
    .update(data.contrasenia)
    .digest("hex");

  const newData = { ...data, contrasenia: hash };

  return await usuariosRepository.create(newData);
};

const update = async (id, data) => {
  if (data.contrasenia) {
    const hash = crypto
      .createHash("sha256")
      .update(data.contrasenia)
      .digest("hex");

    data.contrasenia = hash;
  }

  return await usuariosRepository.update(id, data);
};

const remove = (id) => usuariosRepository.softDelete(id);

const search = (texto) => usuariosRepository.search(texto);

const buscar = async (email, contrasenia) => {

  const hash = crypto
    .createHash("sha256")
    .update(contrasenia)
    .digest("hex");

  return usuariosRepository.buscar(email, hash);
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  search,
  buscar
};