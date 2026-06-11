import { Router } from "express";
import passport from "passport";

import estadisticasController from "../controllers/estadisticas.controller.js";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";

const router = Router();

/**
 * @swagger
 * /estadisticas/generales:
 *   get:
 *     summary: Estadísticas generales de atenciones
 *     tags:
 *       - Estadísticas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Totales de turnos y recaudación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 */
router.get(
  "/generales",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([3]),
  estadisticasController.getGenerales
);

/**
 * @swagger
 * /estadisticas/medicos:
 *   get:
 *     summary: Estadísticas por médico
 *     tags:
 *       - Estadísticas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Turnos y recaudación agrupados por médico
 */
router.get(
  "/medicos",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([3]),
  estadisticasController.getPorMedico
);

/**
 * @swagger
 * /estadisticas/obras-sociales:
 *   get:
 *     summary: Estadísticas por obra social
 *     tags:
 *       - Estadísticas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Turnos y recaudación agrupados por obra social
 */
router.get(
  "/obras-sociales",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([3]),
  estadisticasController.getPorObraSocial
);

/**
 * @swagger
 * /estadisticas/especialidades:
 *   get:
 *     summary: Estadísticas por especialidad
 *     tags:
 *       - Estadísticas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Turnos y recaudación agrupados por especialidad
 */
router.get(
  "/especialidades",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([3]),
  estadisticasController.getPorEspecialidad
);

export default router;