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
 *                 example: ferben@correo.com
 *               contrasenia:
 *                 type: string
 *                 example: ferben
 *     responses:
 *       200:
 *         description: Login correcto
 *       401:
 *         description: Credenciales inválidas
 */

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido"),

    body("contrasenia").notEmpty().withMessage("La contraseña es obligatoria"),

    validarCampos,
  ],
  authController.login,
);

export default router;
