import { Router } from "express";

import reportesController from "../controllers/reportes.controller.js";
import autenticarJWT from "../middlewares/autenticarJWT.js";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";

const router = Router();

router.get(
  "/turnos/pdf",
  autenticarJWT,
  autorizarUsuarios([3]),
  reportesController.turnosPdf
);

export default router;