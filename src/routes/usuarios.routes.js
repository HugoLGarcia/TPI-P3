import { Router } from "express";
import { body, param } from "express-validator";

import { validarCampos } from "../middlewares/validarCampos.js";
import usuariosController from "../controllers/usuarios.controller.js";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import uploadUsuario from "../middlewares/uploadUsuario.js";
import passport from "passport";
import ROLES from "../constants/roles.js";

const router = Router();

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar usuarios
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 */

// Get All - solo administrador
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.ADMIN]),
  usuariosController.getAll
);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */

// Get By ID - solo administrador
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.ADMIN]),
  [
    param("id").isInt().withMessage("El ID debe ser numérico"),
    validarCampos
  ],
  usuariosController.getById
);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear usuario
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *                 example: "40111222"
 *               apellido:
 *                 type: string
 *                 example: Perez
 *               nombres:
 *                 type: string
 *                 example: Juan
 *               email:
 *                 type: string
 *                 example: juanp@correo.com
 *               contrasenia:
 *                 type: string
 *                 example: juanp123
 *               rol:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Usuario creado
 */

// Create - solo administrador
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.ADMIN]),
  [
    body("documento").notEmpty().withMessage("Documento obligatorio"),
    body("apellido").notEmpty().withMessage("Apellido obligatorio"),
    body("nombres").notEmpty().withMessage("Nombres obligatorios"),
    body("email").isEmail().withMessage("Email inválido"),
    body("contrasenia")
      .isLength({ min: 3 })
      .withMessage("La contraseña debe tener al menos 3 caracteres"),
    body("rol").notEmpty().withMessage("Rol obligatorio"),
    validarCampos
  ],
  usuariosController.create
);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: nuevo@correo.com
 *               contrasenia:
 *                 type: string
 *                 example: nueva123
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */

// Update - solo administrador
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.ADMIN]),
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

/**
 * @swagger
 * /usuarios/{id}/foto:
 *   put:
 *     summary: Actualizar foto de usuario
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto actualizada correctamente
 */

router.put(
  "/:id/foto",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.ADMIN]),
  [
    param("id").isInt().withMessage("El ID debe ser numérico"),
    validarCampos
  ],
  uploadUsuario.single("foto"),
  usuariosController.updateFoto
);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */

// Delete - solo administrador
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  autorizarUsuarios([ROLES.ADMIN]),
  [
    param("id").isInt().withMessage("El ID debe ser numérico"),
    validarCampos
  ],
  usuariosController.remove
);

export default router;