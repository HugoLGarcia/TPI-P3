import usuariosRepository from "../repositories/usuarios.repository.js";
import pacientesRepository from "../repositories/pacientes.repository.js";
import crypto from "crypto";

const getAll = () => usuariosRepository.getAll();

const getById = (id) => usuariosRepository.getById(id);

const create = async (data) => {
  const hash = crypto
    .createHash("sha256")
    .update(data.contrasenia)
    .digest("hex");

  const newData = { ...data, contrasenia: hash };

  const usuario = await usuariosRepository.create(newData);

  if (Number(data.rol) === 2) {
    const idObraSocial = data.id_obra_social || 5; // Asignar obra social por defecto si no se proporciona

    await pacientesRepository.create(
      usuario.id_usuario || usuario.id,
      idObraSocial,
    );
  }

  return usuario;
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
  const hash = crypto.createHash("sha256").update(contrasenia).digest("hex");

  return usuariosRepository.buscar(email, hash);
};

// Actualizar foto de usuario
const updateFoto = async (id, fotoPath) => {
  return await usuariosRepository.updateFoto(id, fotoPath);
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  search,
  buscar,
  updateFoto,
};
