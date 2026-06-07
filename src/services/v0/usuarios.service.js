import usuariosRepository from "../../repositories/v0/usuarios.repository.js";
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


// Cambiar estado de usuario por ID
const changeStateId = (id) => usuariosRepository.changeStateId(id);

// Cambiar correo de usuario por ID
const changeEmailId = (id, email) => usuariosRepository.changeEmailId(id, email);

// Registrar usuario genérico (médico o paciente, dependiendo de los datos enviados)
const registerGeneric = (datos) => usuariosRepository.registerGeneric(datos);

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  search,

  changeStateId,
  changeEmailId,
  registerGeneric,

};