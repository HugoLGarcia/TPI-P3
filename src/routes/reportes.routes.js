import { Router } from "express";

import reportesController from "../controllers/reportes.controller.js";
import autenticarJWT from "../middlewares/autenticarJWT.js";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";

const router = Router();
// DOC. SWAGGER
/**
 * @swagger
 * /reportes/turnos/pdf:
 *   get:
 *     summary: Generar reporte PDF de turnos
 *     tags: [Reportes]
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
 *         description: Acceso denegado
 *       500:
 *         description: Error interno del servidor
 */

router.get(
  "/turnos/pdf",
  autenticarJWT,
  autorizarUsuarios([3]),
  reportesController.turnosPdf,
);

export default router;
