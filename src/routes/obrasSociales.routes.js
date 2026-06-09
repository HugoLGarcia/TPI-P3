import { Router } from "express";
import { body, param } from "express-validator";
import passport from "passport";

import obrasSocialesController from "../controllers/obrasSociales.controller.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";

const router = Router();

// Obtener todas
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  obrasSocialesController.getAll
);

// Obtener por ID
router.get(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    param("id").isInt().withMessage("El ID debe ser numérico"),
    validarCampos
  ],
  obrasSocialesController.getById
);

// Crear (solo admin)
router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([3]),

    body("nombre")
      .notEmpty()
      .withMessage("El nombre es obligatorio"),

    body("descripcion")
      .notEmpty()
      .withMessage("La descripción es obligatoria"),

    body("porcentaje_descuento")
      .isNumeric()
      .withMessage("Debe ser un número"),

    body("es_particular")
      .isInt({ min: 0, max: 1 })
      .withMessage("Debe ser 0 o 1"),

    validarCampos
  ],
  obrasSocialesController.create
);

// Actualizar (solo admin)
router.put(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([3]),

    param("id").isInt().withMessage("El ID debe ser numérico"),

    validarCampos
  ],
  obrasSocialesController.update
);

// Eliminar (solo admin)
router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([3]),

    param("id").isInt().withMessage("El ID debe ser numérico"),

    validarCampos
  ],
  obrasSocialesController.remove
);

export default router;