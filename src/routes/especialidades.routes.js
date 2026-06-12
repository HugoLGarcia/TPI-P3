import { Router } from "express";
import { body, param } from "express-validator";

import apicache from "apicache";

import especialidadesController from "../controllers/especialidades.controller.js";
import { validarCampos } from "../middlewares/validarCampos.js";

import passport from "passport";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";

const router = Router();

const cache = apicache.middleware;

// GET ALL
router.get(
  "/",
  cache("5 minutes"),
  //passport.authenticate("jwt", { session: false }),
  //autorizarUsuarios([3]),
  especialidadesController.getAll
);

// GET BY ID
router.get(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([3]),
    param("id")
      .isInt()
      .withMessage("El ID debe ser numérico"),
    validarCampos
  ],
  especialidadesController.getById
);

// CREATE
router.post(
  "/",
  [
    //passport.authenticate("jwt", { session: false }),
    //autorizarUsuarios([3]),

    body("nombre")
      .notEmpty()
      .withMessage("Nombre obligatorio"),

    validarCampos
  ],
  especialidadesController.create
);

// UPDATE
router.put(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([3]),

    param("id")
      .isInt()
      .withMessage("El ID debe ser numérico"),

    body("nombre")
      .optional()
      .notEmpty()
      .withMessage("Nombre inválido"),

    validarCampos
  ],
  especialidadesController.update
);

// DELETE
router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    autorizarUsuarios([3]),

    param("id")
      .isInt()
      .withMessage("El ID debe ser numérico"),

    validarCampos
  ],
  especialidadesController.remove
);

export default router;