import { Router } from "express";
import { body } from "express-validator";

import authController from "../controllers/auth.controller.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@mail.com
 *               contrasenia:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Datos inválidos
 */

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