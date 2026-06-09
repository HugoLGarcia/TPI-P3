import { Router } from "express";
import { param, body } from "express-validator";

import passport from "passport";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";

import medicosController from "../controllers/medicos.controller.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

// GET ALL
router.get(
  "/",
  medicosController.getAll
);

// GET BY ID
router.get(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID debe ser numérico"),
    validarCampos
  ],
  medicosController.getById
);

// ASOCIAR OBRAS SOCIALES
router.post(
  "/:id/obras-sociales",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([3]),

  [
    param("id")
      .isInt()
      .withMessage("El ID del médico debe ser numérico"),

    body("obras_sociales")
      .isArray()
      .withMessage("obras_sociales debe ser un array"),

    validarCampos
  ],

  medicosController.asociarObrasSociales
);

export default router;