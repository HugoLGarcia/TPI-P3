import { Router } from "express";
import { body, param } from "express-validator";

import obrasSocialesController from "../controllers/obrasSociales.controller.js";
import { validarCampos } from "../middlewares/validarCampos.js";

import passport from "passport";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import ROLES from "../constants/roles.js";

const router = Router();

/**
 * @swagger
 * /obras-sociales:
 *   get:
 *     summary: Listar obras sociales
 *     tags:
 *       - Obras Sociales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de obras sociales
 */

// GET ALL
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  obrasSocialesController.getAll
);

/**
 * @swagger
 * /obras-sociales/{id}:
 *   get:
 *     summary: Obtener obra social por ID
 *     tags:
 *       - Obras Sociales
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
 *         description: Obra social encontrada
 *       404:
 *         description: Obra social no encontrada
 */

// GET BY ID
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  param("id").isInt().withMessage("El ID debe ser numérico"),
  validarCampos,
  obrasSocialesController.getById
);

/**
 * @swagger
 * /obras-sociales:
 *   post:
 *     summary: Crear obra social
 *     tags:
 *       - Obras Sociales
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
 *                 example: OSDE
 *               descripcion:
 *                 type: string
 *                 example: Obra social privada
 *               porcentaje_descuento:
 *                 type: number
 *                 example: 25
 *               es_particular:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       201:
 *         description: Obra social creada
 */

// CREATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.ADMIN]),
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
  body("porcentaje_descuento").isNumeric().withMessage("Debe ser un número"),
  body("es_particular").isInt({ min: 0, max: 1 }).withMessage("Debe ser 0 o 1"),
  validarCampos,
  obrasSocialesController.create
);

/**
 * @swagger
 * /obras-sociales/{id}:
 *   put:
 *     summary: Actualizar obra social
 *     tags:
 *       - Obras Sociales
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
 *         description: Obra social actualizada
 */

// UPDATE
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.ADMIN]),
  param("id").isInt().withMessage("El ID debe ser numérico"),
  validarCampos,
  obrasSocialesController.update
);

/**
 * @swagger
 * /obras-sociales/{id}:
 *   delete:
 *     summary: Eliminar obra social
 *     tags:
 *       - Obras Sociales
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
 *         description: Obra social eliminada
 */

// DELETE
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.ADMIN]),
  param("id").isInt().withMessage("El ID debe ser numérico"),
  validarCampos,
  obrasSocialesController.remove
);

export default router;