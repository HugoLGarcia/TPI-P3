import { Router } from "express";
import { check } from "express-validator";
import usuariosController from "../controllers/usuarios.controller.js";
import validarCampos from "../middlewares/validarCampos.js";

const router = Router();

// Rutas de usuarios
router.get("/", usuariosController.getAll);
router.get("/buscar", usuariosController.search);
router.get("/:id", usuariosController.getById);

router.post(
  "/",
  [
    check("documento").notEmpty().withMessage("El documento es obligatorio"),
    check("apellido").notEmpty().withMessage("El apellido es obligatorio"),
    check("nombres").notEmpty().withMessage("Los nombres son obligatorios"),
    check("email").isEmail().withMessage("El email no es válido"),
    check("contrasenia").notEmpty().withMessage("La contraseña es obligatoria"),
    check("rol").isInt({ min: 1, max: 3 }).withMessage("El rol debe ser 1, 2 o 3"),
    validarCampos
  ],
  usuariosController.create
);

router.put(
  "/:id",
  [
    check("email")
      .optional()
      .isEmail()
      .withMessage("El email no es válido"),
    validarCampos
  ],
  usuariosController.update
);

router.delete("/:id", usuariosController.remove);

export default router;