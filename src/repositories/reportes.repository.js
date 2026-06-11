import { pool } from "../db/connection/connection.js";

class ReportesRepository {
  async getTurnosParaPdf() {
    const sql = `
      SELECT
        tr.id_turno_reserva,
        tr.fecha_hora,
        tr.valor_total,
        tr.atentido,
        um.apellido AS medico_apellido,
        um.nombres AS medico_nombres,
        up.apellido AS paciente_apellido,
        up.nombres AS paciente_nombres,
        os.nombre AS obra_social
      FROM turnos_reservas tr
      INNER JOIN medicos m
        ON m.id_medico = tr.id_medico
      INNER JOIN usuarios um
        ON um.id_usuario = m.id_usuario
      INNER JOIN pacientes p
        ON p.id_paciente = tr.id_paciente
      INNER JOIN usuarios up
        ON up.id_usuario = p.id_usuario
      INNER JOIN obras_sociales os
        ON os.id_obra_social = tr.id_obra_social
      WHERE tr.activo = 1
      ORDER BY tr.fecha_hora ASC
    `;

    const [rows] = await pool.execute(sql);

    return rows;
  }
}

export default new ReportesRepository();
