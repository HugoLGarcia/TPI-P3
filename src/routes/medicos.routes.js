import { Router } from "express";
import { param, body } from "express-validator";

import medicosController from "../controllers/medicos.controller.js";
import { validarCampos } from "../middlewares/validarCampos.js";

import passport from "passport";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import ROLES from "../constants/roles.js";

const router = Router();

/**
 * @swagger
 * /medicos:
 *   get:
 *     summary: Listar médicos
 *     tags:
 *       - Médicos
 *     responses:
 *       200:
 *         description: Lista de médicos
 */

// GET ALL
router.get(
  "/",
  medicosController.getAll
);

/**
 * @swagger
 * /medicos:
 *   post:
 *     summary: Crear médico
 *     tags:
 *       - Médicos
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
 *               id_especialidad:
 *                 type: integer
 *                 example: 1
 *               matricula:
 *                 type: integer
 *                 example: 12345
 *               descripcion:
 *                 type: string
 *                 example: "Especialista en clínica"
 *               valor_consulta:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Médico creado
 *       400:
 *         description: Error de datos
 */

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.ADMIN]),

  body("id_usuario").isInt().withMessage("id_usuario debe ser numérico"),
  body("id_especialidad").isInt().withMessage("id_especialidad debe ser numérico"),
  body("matricula").isInt().withMessage("matricula debe ser numérica"),
  body("descripcion").optional().isString(),
  body("valor_consulta").isDecimal().withMessage("valor_consulta debe ser decimal"),

  validarCampos,
  medicosController.create
);

/**
 * @swagger
 * /medicos/{id}:
 *   get:
 *     summary: Obtener médico por ID
 *     tags:
 *       - Médicos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Médico encontrado
 *       404:
 *         description: Médico no encontrado
 */

// GET BY ID
router.get(
  "/:id",
  param("id").isInt().withMessage("El ID debe ser numérico"),
  validarCampos,
  medicosController.getById
);

/**
 * @swagger
 * /medicos/{id}/obras-sociales:
 *   post:
 *     summary: Asociar obras sociales a un médico
 *     tags:
 *       - Médicos
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
 *               obras_sociales:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Obras sociales asociadas correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 */

// ASOCIAR OBRAS SOCIALES
router.post(
  "/:id/obras-sociales",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.ADMIN]),

  param("id").isInt().withMessage("El ID del médico debe ser numérico"),
  body("obras_sociales").isArray().withMessage("obras_sociales debe ser un array"),

  validarCampos,
  medicosController.asociarObrasSociales
);

export default router;