import { pool } from "../db/connection/connection.js";

// Registrar un turno
// Transacción
async function registrarTurno(datos) {
    const { id_medico, id_paciente, id_obra_social, fecha_hora, valor_total } = datos;
    const connection = await pool.getConnection(); 

    try {
        await connection.beginTransaction(); 

        // 1. Insertar Turno
        const sql = `INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, 
            fecha_hora, valor_total, atentido, activo) VALUES (?, ?, ?, ?, ?, 0, 1)`;
        await connection.query(sql, [id_medico, id_paciente, id_obra_social, 
            fecha_hora, valor_total]);

        await connection.commit(); 
        return true;

    } catch (error) {
        await connection.rollback(); // Si algo falló, deshacemos TODO
        console.error("Error al registrar turno:", error);
    } finally {
        connection.release(); // IMPORTANTE: Devolver la conexión al pool
    }
    };

    async function porEspecialidad() {
        const sql = 'CALL sp_reporte_total_turnos_por_especialidad_consola()';
        const [datos] = await pool.execute(sql);
        return datos[0];
    };
    

export default {
  registrarTurno,
  porEspecialidad
};