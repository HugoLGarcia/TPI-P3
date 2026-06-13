import { Router } from "express";
import { body, param } from "express-validator";

import pacientesController from "../controllers/pacientes.controller.js";
import autenticarJWT from "../middlewares/autenticarJWT.js";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();
//DOCUMENTACION SWAGGER

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
  autenticarJWT,
  autorizarUsuarios([3]),
  pacientesController.getAll,
);
//DOCUMENTACION SWAGGER GET BY ID

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
  autenticarJWT,
  autorizarUsuarios([3]),
  [param("id").isInt().withMessage("El ID debe ser numérico"), validarCampos],
  pacientesController.getById,
);

router.post(
  "/",
  autenticarJWT,
  autorizarUsuarios([3]),
  [
    body("id_usuario").isInt().withMessage("id_usuario inválido"),

    body("id_obra_social").isInt().withMessage("id_obra_social inválido"),

    validarCampos,
  ],
  pacientesController.create,
);

// DOCUMENTACION SWAGGER CAMBIAR OBRA SOCIAL
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

// CAMBIAR OBRA SOCIAL
router.put(
  "/:id/obra-social",
  autenticarJWT,
  autorizarUsuarios([3]),
  [
    param("id").isInt().withMessage("El ID debe ser numérico"),

    body("id_obra_social")
      .isInt()
      .withMessage("El id_obra_social debe ser numérico"),

    validarCampos,
  ],
  pacientesController.updateObraSocial,
);

export default router;
