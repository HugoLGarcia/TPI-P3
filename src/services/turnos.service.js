import turnosRepository from "../repositories/turnos.repository.js";
import medicosService from "./medicos.service.js";
import usuariosService from "./usuarios.service.js";
import obrasSocialesService from "./obrassociales.service.js";


const create = async (data) => {

    const medico = await medicosService.getById(data.id_medico);

    const paciente = await usuariosService.getById(data.id_paciente);

    const obra_social = await obrasSocialesService.getById(data.id_obra_social);

    const valor_consulta = medico.valor_consulta - ((obra_social.porcentaje_descuento/100) * 
        medico.valor_consulta);

    data.obra_social = obra_social.id_obra_social;
    data.valor_consulta = valor_consulta;
  
  return await turnosRepository.create(data);
};

export default {
  create
};