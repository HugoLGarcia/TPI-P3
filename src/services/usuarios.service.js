import usuariosRepository from "../repositories/usuarios.repository.js";
import crypto from "crypto";

// B - Obtener todos
const getAll = () => usuariosRepository.getAll();

// R - Obtener por ID
const getById = (id) => usuariosRepository.getById(id);

// A - Crear usuario
const create = async (data) => {
  const hash = crypto
    .createHash("sha256")
    .update(data.contrasenia)
    .digest("hex");

  const newData = { ...data, contrasenia: hash };

  return await usuariosRepository.create(newData);
};

// E - Actualizar usuario
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

// D - Soft delete
const remove = (id) => usuariosRepository.softDelete(id);

export default {
  getAll,
  getById,
  create,
  update,
  remove
};