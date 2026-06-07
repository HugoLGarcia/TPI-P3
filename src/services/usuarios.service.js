import usuariosRepository from "../repositories/usuarios.repository.js";
import crypto from "crypto";

// Obtener todos los usuarios activos
const getAll = () => usuariosRepository.getAll();

// Obtener usuario por ID
const getById = (id) => usuariosRepository.getById(id);

// Crear usuario
const create = async (data) => {
  const hash = crypto
    .createHash("sha256")
    .update(data.contrasenia)
    .digest("hex");

  const newData = { ...data, contrasenia: hash };

  return await usuariosRepository.create(newData);
};

// Actualizar usuario
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

// Eliminar usuario
const remove = (id) => usuariosRepository.softDelete(id);

// Buscar usuarios por apellido o nombre
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