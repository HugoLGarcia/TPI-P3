import { Router } from "express";
import { body, param } from "express-validator";
import passport from "passport";

import turnosReservasController from "../controllers/turnosReservas.controller.js";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

// LISTAR TURNOS
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([1, 2]),
  turnosReservasController.getAll
);

// CREAR TURNO
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([2]),

  [
    body("id_medico")
      .isInt()
      .withMessage("El id_medico debe ser numérico"),

    body("id_paciente")
      .isInt()
      .withMessage("El id_paciente debe ser numérico"),

    body("fecha_hora")
      .notEmpty()
      .withMessage("La fecha_hora es obligatoria"),

    validarCampos
  ],

  turnosReservasController.create
);

router.patch(
  "/:id/atendido",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([1]),

  [
    param("id")
      .isInt()
      .withMessage("El ID debe ser numérico"),

    validarCampos
  ],

  turnosReservasController.marcarAtendido
);

export default router;