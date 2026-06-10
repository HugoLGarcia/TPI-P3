import { Router } from "express";
import { body, param } from "express-validator";

import especialidadesController from "../controllers/especialidades.controller.js";
import { validarCampos } from "../middlewares/validarCampos.js";

import passport from "passport";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";

const router = Router();

//documentacion Swagger
/**
 * @swagger
 * /especialidades:
 *   get:
 *     summary: Obtener todas las especialidades
 *     tags:
 *       - Especialidades
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de especialidades
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 */

// GET ALL
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([3]),
  especialidadesController.getAll,
);
//documentacion Swagger GET BY ID
/**
 * @swagger
 * /especialidades/{id}:
 *   get:
 *     summary: Obtener especialidad por ID
 *     tags:
 *       - Especialidades
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Especialidad encontrada
 *       404:
 *         description: Especialidad no encontrada
 */

// GET BY ID
router.get(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([3]),
    param("id").isInt().withMessage("El ID debe ser numérico"),
    validarCampos,
  ],
  especialidadesController.getById,
);

//documentacion Swagger POST
/**
 * @swagger
 * /especialidades:
 *   post:
 *     summary: Crear especialidad
 *     tags:
 *       - Especialidades
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: DERMATOLOGÍA
 *     responses:
 *       201:
 *         description: Especialidad creada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 */

// CREATE
router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([3]),

    body("nombre").notEmpty().withMessage("Nombre obligatorio"),

    validarCampos,
  ],
  especialidadesController.create,
);
//documentacion Swagger UPDATE

/**
 * @swagger
 * /especialidades/{id}:
 *   put:
 *     summary: Actualizar especialidad
 *     tags:
 *       - Especialidades
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: DERMATOLOGÍA CLÍNICA
 *     responses:
 *       200:
 *         description: Especialidad actualizada
 */


// UPDATE
router.put(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([3]),

    param("id").isInt().withMessage("El ID debe ser numérico"),

    body("nombre").optional().notEmpty().withMessage("Nombre inválido"),

    validarCampos,
  ],
  especialidadesController.update,
);
//documentacion Swagger DELETE

/**
 * @swagger
 * /especialidades/{id}:
 *   delete:
 *     summary: Eliminar especialidad
 *     tags:
 *       - Especialidades
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
 *         description: Especialidad eliminada
 */


// DELETE
router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([3]),

    param("id").isInt().withMessage("El ID debe ser numérico"),

    validarCampos,
  ],
  especialidadesController.remove,
);

export default router;
