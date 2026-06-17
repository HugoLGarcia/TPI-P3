import { Router } from "express";
import { param, body } from "express-validator";

import passport from "passport";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";

import medicosController from "../controllers/medicos.controller.js";
import { validarCampos } from "../middlewares/validarCampos.js";

import autenticarJWT from "../middlewares/autenticarJWT.js";

const router = Router();

//DOC. SWAGGER
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
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([2, 3]),
  medicosController.getAll,
);


//DOC. SWAGGER CREATE MEDICO
/**
 * @swagger
 * /medicos:
 *   post:
 *     summary: Crear médico completando un usuario existente con rol médico
 *     tags:
 *       - Médicos
 *     security:
 *       - bearerAuth: []
 *     description: Primero debe existir un usuario con rol médico. Este endpoint crea el perfil médico asociado a ese id_usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_usuario
 *               - id_especialidad
 *               - matricula
 *               - valor_consulta
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 example: 8
 *               id_especialidad:
 *                 type: integer
 *                 example: 1
 *               matricula:
 *                 type: integer
 *                 example: 12345
 *               descripcion:
 *                 type: string
 *                 example: Cardiología general
 *               valor_consulta:
 *                 type: number
 *                 example: 5000
 *               obras_sociales:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *     responses:
 *       201:
 *         description: Médico creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 *       500:
 *         description: Error interno
 */

router.post(
  "/",
  autenticarJWT,
  autorizarUsuarios([3]),

  [
    body("id_usuario").isInt().withMessage("id_usuario debe ser numérico"),

    body("id_especialidad")
      .isInt()
      .withMessage("id_especialidad debe ser numérico"),

    body("matricula").isInt().withMessage("matricula debe ser numérica"),

    body("descripcion").optional().isString(),

    body("valor_consulta")
      .isDecimal()
      .withMessage("valor_consulta debe ser decimal"),

    validarCampos,
  ],

  medicosController.create,
);

//DOC. SWAGGER GET BY ID

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

// especialidad
router.get(
  "/especialidad/:idEspecialidad",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([2, 3]),
    param("idEspecialidad")
      .isInt()
      .withMessage("El ID de especialidad debe ser numérico"),
    validarCampos,
  ],
  medicosController.getByEspecialidad,
);

// GET BY ID
router.get(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([2, 3]),
    param("id").isInt().withMessage("El ID debe ser numérico"),
    validarCampos,
  ],
  medicosController.getById,
);

//DOC. SWAGGER ASOCIAR OBRAS SOCIALES
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
  autorizarUsuarios([3]),

  [
    param("id").isInt().withMessage("El ID del médico debe ser numérico"),

    body("obras_sociales")
      .isArray()
      .withMessage("obras_sociales debe ser un array"),

    validarCampos,
  ],

  medicosController.asociarObrasSociales,
);

export default router;
