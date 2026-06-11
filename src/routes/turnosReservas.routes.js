import { Router } from "express";
import { body, param } from "express-validator";

import turnosReservasController from "../controllers/turnosReservas.controller.js";
import passport from "passport";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import ROLES from "../constants/roles.js";

const router = Router();

/**
 * @swagger
 * /turnos-reservas:
 *   get:
 *     summary: Listar turnos del usuario autenticado
 *     tags:
 *       - Turnos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 */

// LISTAR TURNOS
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.MEDICO, ROLES.PACIENTE]),
  turnosReservasController.getAll
);

/**
 * @swagger
 * /turnos-reservas:
 *   post:
 *     summary: Crear turno
 *     tags:
 *       - Turnos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_medico:
 *                 type: integer
 *                 example: 1
 *               id_paciente:
 *                 type: integer
 *                 example: 1
 *               fecha_hora:
 *                 type: string
 *                 example: "2026-06-20 10:00:00"
 *     responses:
 *       201:
 *         description: Turno creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 */

// CREAR TURNO
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([,ROLES.ADMIN, ROLES.PACIENTE]),

  body("id_medico")
    .isInt()
    .withMessage("El id_medico debe ser numérico"),

  body("id_paciente")
    .isInt()
    .withMessage("El id_paciente debe ser numérico"),

  body("fecha_hora")
    .notEmpty()
    .withMessage("La fecha_hora es obligatoria"),

  validarCampos,

  turnosReservasController.create
);

/**
 * @swagger
 * /turnos-reservas/{id}/atendido:
 *   patch:
 *     summary: Marcar turno como atendido
 *     tags:
 *       - Turnos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 8
 *     responses:
 *       200:
 *         description: Turno marcado como atendido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Turno no encontrado
 */

// MARCAR ATENDIDO
router.patch(
  "/:id/atendido",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.MEDICO]),

  param("id")
    .isInt()
    .withMessage("El ID debe ser numérico"),

  validarCampos,

  turnosReservasController.marcarAtendido
);

export default router;