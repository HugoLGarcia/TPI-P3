import { Router } from "express";
import multer from "multer";

import { validarCorreo } from "../../middlewares/validarCampos.js";
import usuariosController from "../../controllers/v0/usuarios.controller.js";

import { storage } from "../../config/multer.js";

import usuariosRoutes from "../../routes/usuarios.routes.js";

const router = Router();

// Rutas de usuarios
/**
 * @openapi
 * /usuarios:
 *   get:
 *     summary: Devuelve la lista de usuarios
 *     responses:
 *       200:
 *         description: Éxito
 */
router.get("/", usuariosController.getAll);
/**
 * @openapi
 * /usuarios/buscar:
 *   get:
 *     summary: Devuelve la lista de usuarios filtrada por texto
 *     parameters:
 *       - in: query
 *         name: texto
 *         schema:
 *           type: string
 *         description: Texto a buscar en los nombres o apellidos de los usuarios
 *     responses:
 *       200:
 *         description: Éxito
 */
router.get("/buscar", usuariosController.search); //va antes de /:id, porque si no Express lo toma como un ID
/**
 * @openapi
 * /usuarios/{id}:
 *   get:
 *     summary: Devuelve un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a obtener
 *     responses:
 *       200:
 *         description: Éxito
 */
router.get("/:id", usuariosController.getById);
/**
 * @openapi
 * /usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Pedro
 *               apellido:
 *                 type: string
 *                 example: Perez
 *               email:
 *                 type: string
 *                 example: pedro.perez@correo.com
 *               contrasenia:
 *                 type: string
 *                 example: password123
 *               rol:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 */
router.post("/", usuariosController.create);

/**
 * @openapi
 * /usuarios/{id}:
 *   put:
 *     summary: Modifica un usuario existente por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del usuario a modificar
 *         example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Pedro
 *               apellido:
 *                 type: string
 *                 example: Perez
 *               email:
 *                 type: string
 *                 example: pedro.perez@correo.com
 *               contrasenia:
 *                 type: string
 *                 example: password123
 *               rol:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *       404:
 *         description: Usuario no encontrado
 */
router.put("/:id", usuariosController.update);

/**
 * @openapi
 * /usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario existente por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del usuario que se desea eliminar
 *         example: 5
 *     responses:
 *       200:
 *         description: Usuario eliminado con éxito
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/:id", usuariosController.remove);

/**
 * @openapi
 * /usuarios/estado/{id}:
 *   patch:
 *     summary: Alterna el estado del usuario (lo activa si está inactivo y viceversa)
 *     description: El backend busca al usuario por su ID e invierte automáticamente su estado actual en la base de datos.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del usuario a modificar
 *         example: 15
 *     responses:
 *       200:
 *         description: Estado alternado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Estado del usuario actualizado correctamente"
 *                 nuevoEstado:
 *                   type: boolean
 *                   description: El nuevo estado asignado por el backend
 *                   example: false
 *       404:
 *         description: No se encontró ningún usuario con ese ID
 */
router.patch("/estado/:id", usuariosController.changeStateId);


router.patch("/correo/:id", validarCorreo, usuariosController.changeEmailId);

/**
 * @openapi
 * /usuarios/generico:
 *   post:
 *     summary: Registro único de usuarios (Médico o Paciente)
 *     description: Registra un usuario con estructura plana. Los campos específicos dependen del valor del rol (1 = Médico, 2 = Paciente).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: El esquema acepta los campos de ambos roles, pero se validan según el rol enviado.
 *           examples:
 *             EjemploMedico:
 *               summary: Registrar como Médico (Rol 1)
 *               description: Ejemplo de JSON plano para dar de alta a un médico.
 *               value:
 *                 documento: "91014"
 *                 apellido: "Perez"
 *                 nombres: "Luis"
 *                 email: "wggww9@correo.com"
 *                 contrasenia: "texto"
 *                 foto_path: ""
 *                 rol: 1
 *                 especialidad: 4
 *                 matricula: 1
 *                 descripcion: ""
 *                 valor_consulta: 100000
 *             EjemploPaciente:
 *               summary: Registrar como Paciente (Rol 2)
 *               description: Ejemplo de JSON plano para dar de alta a un paciente.
 *               value:
 *                 documento: "91014"
 *                 apellido: "Perez"
 *                 nombres: "Luis"
 *                 email: "wggww9@correo.com"
 *                 contrasenia: "texto"
 *                 foto_path: ""
 *                 rol: 2
 *                 obra_social: 2
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *       400:
 *         description: Datos de entrada inválidos o faltantes.
 */
router.post("/generico", usuariosController.registerGeneric);


router.use("/", usuariosRoutes);

export default router;
