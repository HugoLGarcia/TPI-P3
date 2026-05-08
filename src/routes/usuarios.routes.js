import { Router } from "express";
import usuariosController from "../controllers/usuarios.controller.js";
import { validarCorreo } from "../middlewares/validarCampos.js";

const router = Router();

// Rutas de usuarios
router.get("/", usuariosController.getAll);
router.get("/buscar", usuariosController.search); //va antes de /:id, porque si no Express lo toma como un ID
router.get("/:id", usuariosController.getById);
router.post("/", usuariosController.create);
router.put("/:id", usuariosController.update);
router.delete("/:id", usuariosController.remove);
router.delete("/estado/:id", usuariosController.changeStateId);
router.patch("/correo/:id", validarCorreo, usuariosController.changeEmailId);
router.post("/generico", usuariosController.registerGeneric);

export default router;
