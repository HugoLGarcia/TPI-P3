import { Router } from "express";
import multer from "multer";

import { body, param, check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";
import usuariosController from "../controllers/usuarios.controller.js";
import passport from "passport";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import autenticarJWT from "../middlewares/autenticarJWT.js";

import { storage } from "../config/multer.js";

const upload = multer({ storage });
const router = Router();

// BREAD

// Get All
router.get(
  "/",
  autenticarJWT,
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([3]),
  usuariosController.getAll
);

// GET BY ID con validación
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([3]),
  [
    param("id").isInt().withMessage("El ID debe ser numérico"),
    validarCampos
  ],
  usuariosController.getById
);

// Obtener paciente por Id
router.get(
  "/:id/paciente",
  //passport.authenticate("jwt", { session: false }),
  //autorizarUsuarios([3]),
  [
    param("id").isInt().withMessage("El ID debe ser numérico"),
    validarCampos
  ],
  usuariosController.getPacienteById
);

// Create
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

// Update
router.put(
  "/:id",
  upload.single("foto_path"),
  [
    param("id").isInt().withMessage("El ID debe ser numérico"),
    body("documento").notEmpty().withMessage("Documento obligatorio"),
    body("apellido").notEmpty().withMessage("Apellido obligatorio"),
    body("nombres").notEmpty().withMessage("Nombres obligatorios"),
    body("email").optional().isEmail().withMessage("Email inválido"),
    body("contrasenia")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Mínimo 6 caracteres"),
    validarCampos
  ],
  usuariosController.update
);

// Update
router.patch(
  "/:id",
  upload.single("foto_path"),
  [
    param("id").isInt().withMessage("El ID debe ser numérico"),
    body("apellido").notEmpty().withMessage("Apellido obligatorio"),
    body("nombres").notEmpty().withMessage("Nombres obligatorios"),
    validarCampos
  ],
  usuariosController.update2);



// Delete
router.delete(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser numérico"),
    validarCampos
  ],
  usuariosController.remove
);

export default router;
