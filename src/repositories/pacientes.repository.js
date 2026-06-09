import { pool } from "../db/connection/connection.js";

class PacientesRepository {

    async getById(id) {

        const sql = `
            SELECT *
            FROM pacientes
            WHERE id_paciente = ?
        `;

        const [rows] = await pool.execute(sql, [id]);

        return rows[0] || null;
    }

}

export default new PacientesRepository();