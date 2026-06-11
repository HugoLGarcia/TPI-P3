import { Router } from "express";

import reportesController from "../controllers/reportes.controller.js";
import passport from "passport";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import ROLES from "../constants/roles.js";

const router = Router();

/**
 * @swagger
 * /reportes/turnos/pdf:
 *   get:
 *     summary: Generar reporte PDF de turnos
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 */

router.get(
  "/turnos/pdf",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.ADMIN]),
  reportesController.turnosPdf
);

export default router;