import { Router } from "express";
import usuariosController from "../controllers/usuarios.controller.js";

const router = Router();

// BREAD
router.get("/", usuariosController.getAll);
router.get("/:id", usuariosController.getById);
router.post("/", usuariosController.create);
router.put("/:id", usuariosController.update);
router.delete("/:id", usuariosController.remove);

export default router;