import { Router } from "express";
import { body, param } from "express-validator";
import passport from "passport";

import obrasSocialesController from "../controllers/obrasSociales.controller.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";

const router = Router();
//DOCUMENTACION SWAGGER

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

// Obtener todas
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  obrasSocialesController.getAll,
);

//DOCUMENTACION SWAGGER GOBTENER X ID
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

// Obtener por ID
router.get(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    param("id").isInt().withMessage("El ID debe ser numérico"),
    validarCampos,
  ],
  obrasSocialesController.getById,
);

//DOCUMENTACION SWAGGER CREAR
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

// Crear (solo admin)
router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([3]),

    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),

    body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),

    body("porcentaje_descuento").isNumeric().withMessage("Debe ser un número"),

    body("es_particular")
      .isInt({ min: 0, max: 1 })
      .withMessage("Debe ser 0 o 1"),

    validarCampos,
  ],
  obrasSocialesController.create,
);

//DOC. SWAGGER ACTUALIZAR
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

// Actualizar (solo admin)
router.put(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([3]),

    param("id").isInt().withMessage("El ID debe ser numérico"),

    validarCampos,
  ],
  obrasSocialesController.update,
);

//DOCUMENTACION SWAGGER ELIMINAR

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

// Eliminar (solo admin)
router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([3]),

    param("id").isInt().withMessage("El ID debe ser numérico"),

    validarCampos,
  ],
  obrasSocialesController.remove,
);

export default router;
