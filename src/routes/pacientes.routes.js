import { Router } from "express";
import { body, param } from "express-validator";

import pacientesController from "../controllers/pacientes.controller.js";
import autenticarJWT from "../middlewares/autenticarJWT.js";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

// GET ALL
router.get(
  "/",
  autenticarJWT,
  autorizarUsuarios([3]),
  pacientesController.getAll,
);

// GET BY ID
router.get(
  "/:id",
  autenticarJWT,
  autorizarUsuarios([3]),
  [param("id").isInt().withMessage("El ID debe ser numérico"), validarCampos],
  pacientesController.getById,
);

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
