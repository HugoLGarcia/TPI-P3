export const toTurnoDTO = (t) => {
  return {
    fecha_hora: t.fecha_hora,
    valor_total: Number(t.valor_total),

    estado: t.atentido === 1 ? "ATENDIDO" : "PENDIENTE",

    medico: {
      nombre: t.medico_nombres,
      apellido: t.medico_apellido,
      email: t.medico_email,
      especialidad: t.especialidad
    },

    paciente: {
      nombre: t.paciente_nombres,
      apellido: t.paciente_apellido,
      email: t.paciente_email
    },

    obra_social: t.obra_social
  };
};
