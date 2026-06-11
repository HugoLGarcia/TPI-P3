import { pool } from "../db/connection/connection.js";

class TurnosReservasRepository {

    async create(turnoReserva) {
        const {
            id_medico,
            id_paciente,
            id_obra_social,
            fecha_hora,
            valor_total
        } = turnoReserva;

        const sql = `
            INSERT INTO turnos_reservas
            (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(sql, [
            id_medico,
            id_paciente,
            id_obra_social,
            fecha_hora,
            valor_total
        ]);

        if (result.affectedRows === 0) {
            return null;
        }

        return result.insertId;
    }

    async getTurnosByMedico(id_usuario) {
        const sql = `
        SELECT 
            tr.fecha_hora,
            tr.valor_total,

            m.id_medico,
            u_medico.nombres AS medico_nombres,
            u_medico.apellido AS medico_apellido,
            u_medico.email AS medico_email,

            e.nombre AS especialidad,

            p.id_paciente,
            u_paciente.nombres AS paciente_nombres,
            u_paciente.apellido AS paciente_apellido,
            u_paciente.email AS paciente_email,

            os.nombre AS obra_social

        FROM turnos_reservas tr

        INNER JOIN medicos m 
            ON m.id_medico = tr.id_medico

        INNER JOIN usuarios u_medico 
            ON u_medico.id_usuario = m.id_usuario

        INNER JOIN pacientes p 
            ON p.id_paciente = tr.id_paciente

        INNER JOIN usuarios u_paciente 
            ON u_paciente.id_usuario = p.id_usuario

        INNER JOIN especialidades e 
            ON e.id_especialidad = m.id_especialidad

        INNER JOIN obras_sociales os 
            ON os.id_obra_social = tr.id_obra_social

        WHERE u_medico.id_usuario = ?
    `;

        const [turnos] = await pool.execute(sql, [id_usuario]);
        return turnos;
    }

    async getTurnosByPaciente(id_usuario) {
        const sql = `
        SELECT 
            tr.fecha_hora,
            tr.valor_total,
            tr.atendido,
            m.id_medico,
            u_medico.nombres AS medico_nombres,
            u_medico.apellido AS medico_apellido,
            u_medico.email AS medico_email,

            e.nombre AS especialidad,

            p.id_paciente,
            u_paciente.nombres AS paciente_nombres,
            u_paciente.apellido AS paciente_apellido,
            u_paciente.email AS paciente_email,

            os.nombre AS obra_social

        FROM turnos_reservas tr

        INNER JOIN pacientes p 
            ON p.id_paciente = tr.id_paciente

        INNER JOIN usuarios u_paciente 
            ON u_paciente.id_usuario = p.id_usuario

        INNER JOIN medicos m 
            ON m.id_medico = tr.id_medico

        INNER JOIN usuarios u_medico 
            ON u_medico.id_usuario = m.id_usuario

        INNER JOIN especialidades e 
            ON e.id_especialidad = m.id_especialidad

        INNER JOIN obras_sociales os 
            ON os.id_obra_social = tr.id_obra_social

        WHERE u_paciente.id_usuario = ?
    `;

        const [turnos] = await pool.execute(sql, [id_usuario]);
        return turnos;
    }

    async marcarAtendido(id_turno) {

        const sql = `
        UPDATE turnos_reservas
        SET atendido = 1
        WHERE id_turno_reserva = ?
        AND activo = 1
    `;

        const [result] = await pool.execute(
            sql,
            [id_turno]
        );

        return result.affectedRows;
    }

    async getTurnoById(id_turno) {

        const sql = `
        SELECT
            tr.id_turno_reserva,
            tr.id_medico,
            tr.atendido,
            m.id_usuario
        FROM turnos_reservas tr
        INNER JOIN medicos m
            ON m.id_medico = tr.id_medico
        WHERE tr.id_turno_reserva = ?
        AND tr.activo = 1
    `;

        const [rows] = await pool.execute(sql, [id_turno]);

        return rows[0] || null;
    }

    async existeTurnoMedico(id_medico, fecha_hora) {

        const sql = `
        SELECT id_turno_reserva
        FROM turnos_reservas
        WHERE id_medico = ?
        AND fecha_hora = ?
        AND activo = 1
    `;

        const [rows] = await pool.execute(
            sql,
            [id_medico, fecha_hora]
        );

        return rows.length > 0;
    }

    async existeTurnoPaciente(id_paciente, fecha_hora) {

        const sql = `
        SELECT id_turno_reserva
        FROM turnos_reservas
        WHERE id_paciente = ?
        AND fecha_hora = ?
        AND activo = 1
    `;

        const [rows] = await pool.execute(
            sql,
            [id_paciente, fecha_hora]
        );

        return rows.length > 0;
    }
}

export default new TurnosReservasRepository();