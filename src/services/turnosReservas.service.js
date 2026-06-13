import turnosReservasRepository from "../repositories/turnosReservas.repository.js";
import medicosService from "./medicos.service.js";
import pacientesService from "./pacientes.service.js";
import obrasSocialesService from "./obrasSociales.service.js";
import { toTurnoDTO } from "../dtos/turnosdto.js";

const getAll = async (usuario) => {
  let turnos;

  if (usuario.rol === 1) {
    turnos = await turnosReservasRepository.getTurnosByMedico(
      usuario.id_usuario,
    );
  } else {
    turnos = await turnosReservasRepository.getTurnosByPaciente(
      usuario.id_usuario,
    );
  }

  return turnos.map(toTurnoDTO);
};

const create = async (turnoReserva) => {
  const fechaTurno = new Date(turnoReserva.fecha_hora);
  const minutos = fechaTurno.getMinutes();

  if (![0, 15, 30, 45].includes(minutos)) {
    throw new Error("Los turnos solo pueden reservarse cada 15 minutos");
  }

  const medico = await medicosService.getById(turnoReserva.id_medico);

  if (!medico) {
    throw new Error("El médico no existe");
  }

  const paciente = await pacientesService.getById(turnoReserva.id_paciente);

  if (!paciente) {
    throw new Error("El paciente no existe");
  }

  const turnoMedicoExiste = await turnosReservasRepository.existeTurnoMedico(
    turnoReserva.id_medico,
    turnoReserva.fecha_hora,
  );

  if (turnoMedicoExiste) {
    throw new Error("El médico ya tiene un turno asignado en ese horario");
  }

  const turnoPacienteExiste =
    await turnosReservasRepository.existeTurnoPaciente(
      turnoReserva.id_paciente,
      turnoReserva.fecha_hora,
    );

  if (turnoPacienteExiste) {
    throw new Error("El paciente ya tiene un turno asignado en ese horario");
  }

  const obraSocial = await obrasSocialesService.getById(
    paciente.id_obra_social,
  );

  if (!obraSocial) {
    throw new Error("La obra social no existe");
  }

  let valor = Number(medico.valor_consulta);

  if (obraSocial.es_particular === 0) {
    const descuento = valor * (obraSocial.porcentaje_descuento / 100);

    valor = valor - descuento;
  }

  turnoReserva.valor_total = valor;
  turnoReserva.id_obra_social = paciente.id_obra_social;

  return await turnosReservasRepository.create(turnoReserva);
};

const marcarAtendido = async (id_turno, id_usuario) => {
  const turno = await turnosReservasRepository.getTurnoById(id_turno);

  if (!turno) {
    throw new Error("Turno no encontrado");
  }

  if (turno.id_usuario !== id_usuario) {
    throw new Error("No tiene permisos para modificar este turno");
  }

  if (turno.atentido === 1) {
    throw new Error("El turno ya fue marcado como atendido");
  }

  await turnosReservasRepository.marcarAtendido(id_turno);

  return true;
};

export default {
  getAll,
  create,
  marcarAtendido,
};
