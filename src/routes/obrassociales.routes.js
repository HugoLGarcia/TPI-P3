import { Router } from "express";
import { body, param } from "express-validator";

import obrassocialesController from "../controllers/obrassociales.controller.js";
import { validarCampos } from "../middlewares/validarCampos.js";

import passport from "passport";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";

const router = Router();

// GET ALL
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([3]),
  obrassocialesController.getAll
);

// GET BY ID
router.get(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([3]),
    param("id")
      .isInt()
      .withMessage("El ID debe ser numérico"),
    validarCampos
  ],
  obrassocialesController.getById
);

// CREATE
router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([3]),

    body("nombre")
      .notEmpty()
      .withMessage("Nombre obligatorio"),

    body("descripcion")
      .notEmpty()
      .withMessage("Descripción obligatoria"),

    body("descuento")
      .notEmpty()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Porcentaje de descuento obligatorio"),

    validarCampos
  ],
  obrassocialesController.create
);

// UPDATE
router.put(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([3]),

    param("id")
      .isInt()
      .withMessage("El ID debe ser numérico"),

    body("nombre")
      .optional()
      .notEmpty()
      .withMessage("Nombre inválido"),

    body("descripcion")
      .optional()
      .notEmpty()
      .withMessage("Descripción inválida"),

    body("descuento")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Porcentaje de descuento inválido"),

    validarCampos
  ],
  obrassocialesController.update
);

// DELETE
router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([3]),

    param("id")
      .isInt()
      .withMessage("El ID debe ser numérico"),

    validarCampos
  ],
  obrassocialesController.remove
);

export default router;