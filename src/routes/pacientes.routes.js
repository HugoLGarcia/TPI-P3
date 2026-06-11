import { Router } from "express";
import { body, param } from "express-validator";

import pacientesController from "../controllers/pacientes.controller.js";
import { validarCampos } from "../middlewares/validarCampos.js";

import passport from "passport";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import ROLES from "../constants/roles.js";

const router = Router();

/**
 * @swagger
 * /pacientes:
 *   get:
 *     summary: Listar pacientes
 *     tags:
 *       - Pacientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pacientes
 */

// GET ALL
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.ADMIN]),
  pacientesController.getAll
);

/**
 * @swagger
 * /pacientes/{id}:
 *   get:
 *     summary: Obtener paciente por ID
 *     tags:
 *       - Pacientes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paciente encontrado
 */

// GET BY ID
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.ADMIN]),
  param("id").isInt().withMessage("El ID debe ser numérico"),
  validarCampos,
  pacientesController.getById
);

/**
 * @swagger
 * /pacientes:
 *   post:
 *     summary: Crear paciente
 *     tags:
 *       - Pacientes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 example: 10
 *               id_obra_social:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Paciente creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 */

//CREATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.ADMIN]),
  body("id_usuario").isInt().withMessage("id_usuario inválido"),
  body("id_obra_social").isInt().withMessage("id_obra_social inválido"),
  validarCampos,
  pacientesController.create
);

/**
 * @swagger
 * /pacientes/{id}/obra-social:
 *   put:
 *     summary: Actualizar obra social de un paciente
 *     tags:
 *       - Pacientes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_obra_social:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Obra social del paciente actualizada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Paciente no encontrado
 */

// UPDATE OBRA SOCIAL
router.put(
  "/:id/obra-social",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.ADMIN]),
  param("id").isInt().withMessage("El ID debe ser numérico"),
  body("id_obra_social").isInt().withMessage("El id_obra_social debe ser numérico"),
  validarCampos,
  pacientesController.updateObraSocial
);

export default router;