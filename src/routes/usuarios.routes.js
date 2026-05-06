import { Router } from "express";
import { body, param } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";
import usuariosController from "../controllers/usuarios.controller.js";

const router = Router();

// BREAD

// ✅ GET ALL
router.get("/", usuariosController.getAll);

// ✅ GET BY ID con validación
router.get(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser numérico"),
    validarCampos
  ],
  usuariosController.getById
);

// ✅ CREATE
router.post(
  "/",
  [
    body("documento").notEmpty().withMessage("Documento obligatorio"),
    body("apellido").notEmpty().withMessage("Apellido obligatorio"),
    body("nombres").notEmpty().withMessage("Nombres obligatorios"),
    body("email").isEmail().withMessage("Email inválido"),
    body("contrasenia")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("rol").notEmpty().withMessage("Rol obligatorio"),
    validarCampos
  ],
  usuariosController.create
);

// ✅ UPDATE
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser numérico"),
    body("email").optional().isEmail().withMessage("Email inválido"),
    body("contrasenia")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Mínimo 6 caracteres"),
    validarCampos
  ],
  usuariosController.update
);

// ✅ DELETE
router.delete(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser numérico"),
    validarCampos
  ],
  usuariosController.remove
);

export default router;