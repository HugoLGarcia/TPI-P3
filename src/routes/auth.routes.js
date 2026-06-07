import { Router } from "express";
import { body } from "express-validator";

import authController from "../controllers/auth.controller.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Email inválido"),

    body("contrasenia")
      .notEmpty()
      .withMessage("La contraseña es obligatoria"),

    validarCampos
  ],
  authController.login
);

export default router;