import { pool } from "../db/connection/connection.js";

class PacientesRepository {
  async getAll() {
    const sql = `
      SELECT
        p.id_paciente,
        p.id_usuario,
        u.documento,
        u.apellido,
        u.nombres,
        u.email,
        p.id_obra_social,
        os.nombre AS obra_social
      FROM pacientes p
      INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
      INNER JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
      WHERE u.activo = 1
      ORDER BY u.apellido, u.nombres
    `;

    const [rows] = await pool.execute(sql);
    return rows;
  }

  async create(idUsuario, idObraSocial) {
    const sql = `
    INSERT INTO pacientes
    (id_usuario, id_obra_social)
    VALUES (?, ?)
  `;

    const [result] = await pool.execute(sql, [
      idUsuario,
      idObraSocial
    ]);

    return {
      id_paciente: result.insertId,
      id_usuario: idUsuario,
      id_obra_social: idObraSocial
    };
  }

  async getById(id) {
    const sql = `
      SELECT
        p.id_paciente,
        p.id_usuario,
        u.documento,
        u.apellido,
        u.nombres,
        u.email,
        p.id_obra_social,
        os.nombre AS obra_social
      FROM pacientes p
      INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
      INNER JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
      WHERE p.id_paciente = ?
        AND u.activo = 1
    `;

    const [rows] = await pool.execute(sql, [id]);

    return rows[0] || null;
  }

  async updateObraSocial(idPaciente, idObraSocial) {
    const sql = `
      UPDATE pacientes
      SET id_obra_social = ?
      WHERE id_paciente = ?
    `;

    const [result] = await pool.execute(sql, [
      idObraSocial,
      idPaciente
    ]);

    return {
      affectedRows: result.affectedRows
    };
  }
}

export default new PacientesRepository();