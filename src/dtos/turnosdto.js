export const toTurnoDTO = (t) => {
    return {
        fecha_hora: t.fecha_hora,
        valor_total: Number(t.valor_total),

        estado: t.atendido === 1 ? "ATENDIDO" : "PENDIENTE",

        medico: {
            nombre: t.medico_nombres,
            apellido: t.medico_apellido,
            email: t.medico_email,
            especialidad: t.especialidad
        },

        obra_social: t.obra_social
    };
};