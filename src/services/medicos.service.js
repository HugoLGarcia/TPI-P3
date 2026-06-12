import medicosRepository from "../repositories/medicos.repository.js";

// Obtener todos médicos activos
const getAll = () => medicosRepository.getAll();

// Obtener médico por ID
const getById = (id) => medicosRepository.getById(id);

const asociarMedicoConObraSocial = (id_medico, obras_sociales) => 
    medicosRepository.asociarMedicoConObraSocial(id_medico, obras_sociales);

/*
const asociarMedicoConEspecialidad = (id_medico, especialidades) => 
    medicosRepository.asociarMedicoConEspecialidad(id_medico, especialidades);
*/

export default {
  getAll,
  getById,
  asociarMedicoConObraSocial,
  //asociarMedicoConEspecialidad
};
