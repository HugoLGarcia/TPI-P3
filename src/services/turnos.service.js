import turnosRepository from "../repositories/turnos.repository.js";
import medicosService from "./medicos.service.js";
import usuariosService from "./usuarios.service.js";
import obrasSocialesService from "./obrassociales.service.js";
import informesService from "./informes.services.js";


const create = async (data) => {

  const medico = await medicosService.getById(data.id_medico);
    
  const paciente = await usuariosService.getPacienteById(data.id_paciente);
    
  const obra_social = await obrasSocialesService.getById(paciente.id_obra_social);
    
  let valor = medico.valor_consulta 
  console.log(valor); 
  if (obra_social.es_particular === 0){ 
    valor = valor - (obra_social.porcentaje_descuento * valor);

  console.log(valor);
  data.id_obra_social = obra_social.id_obra_social;
  data.valor_total = valor;
  
  console.log(data);
  return await turnosRepository.registrarTurno(data);
      }
};

 const porEspecialidad = async () => {
        // BUSCO LOS DATOS
        const datos = await turnosRepository.porEspecialidad();
        console.log(datos);
        // SERVICIO PARA GENERAR ARCHIVO PDF         
        const pdf = await informesService.reportePorEspecialidades(datos);
       
  
        return {
            buffer: Buffer.from(pdf),  
            headers: {
                'Content-Type': 'application/pdf', 
                'Content-Disposition':'inline; filename="reporte.pdf"'
            }
        }
    }

export default {
  create,
  porEspecialidad
};