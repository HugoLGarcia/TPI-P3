import { Router } from "express";
import { validarCorreo } from "../../middlewares/validarCampos.js";
import usuariosController from "../../controllers/v0/usuarios.controller.js";

import usuariosRoutes from "../../routes/usuarios.routes.js";

const router = Router();

// Rutas de usuarios
router.get("/", usuariosController.getAll);
router.get("/buscar", usuariosController.search); //va antes de /:id, porque si no Express lo toma como un ID
router.get("/:id", usuariosController.getById);
router.post("/", usuariosController.create);
router.put("/:id", usuariosController.update);
router.delete("/:id", usuariosController.remove);
router.patch("/estado/:id", usuariosController.changeStateId);
router.patch("/correo/:id", validarCorreo, usuariosController.changeEmailId);
router.post("/generico", usuariosController.registerGeneric);

router.use("/", usuariosRoutes);

export default router;
