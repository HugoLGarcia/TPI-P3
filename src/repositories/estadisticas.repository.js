import { pool } from "../db/connection/connection.js";

const getGenerales = async () => {
  const [rows] = await pool.query("CALL sp_estadisticas_generales()");
  return rows[0][0];
};

const getPorMedico = async () => {
  const [rows] = await pool.query("CALL sp_estadisticas_por_medico()");
  return rows[0];
};

const getPorObraSocial = async () => {
  const [rows] = await pool.query("CALL sp_estadisticas_por_obra_social()");
  return rows[0];
};

const getPorEspecialidad = async () => {
  const [rows] = await pool.query("CALL sp_estadisticas_por_especialidad()");
  return rows[0];
};

export default {
  getGenerales,
  getPorMedico,
  getPorObraSocial,
  getPorEspecialidad,
};