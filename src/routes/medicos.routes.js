import { Router } from "express";
import { body, param, check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";
import medicosController from "../controllers/medicos.controller.js";
import passport from "passport";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import autenticarJWT from "../middlewares/autenticarJWT.js";

const router = Router();

// Obtener todos los médicos activos
router.get(
  "/",
  //autenticarJWT,
  //passport.authenticate("jwt", { session: false }),
  //autorizarUsuarios([3]),
  medicosController.getAll
);

// Obtener médico por ID
router.get(
  "/:id",
  //passport.authenticate("jwt", { session: false }),
  //autorizarUsuarios([3]),
  [
    param("id").isInt().withMessage("El ID debe ser numérico"),
    validarCampos
  ],
  medicosController.getById
);

router.post(
    "/:id_medico/obras-sociales",
    [        
        param('id_medico')
            .notEmpty().withMessage('El id_medico es obligatorio.')
            .isInt().withMessage('El id_medico debe ser un número entero.'),
        check('obras_sociales')
            .isArray().withMessage('obras_sociales debe ser un array.')
            .notEmpty().withMessage('obras_sociales no puede estar vacío.'),
        check('obras_sociales.*.id_obra_social') 
            .notEmpty().withMessage('Cada obra social debe tener id_obra_social.')
            .isInt().withMessage('id_obra_social debe ser un número entero.'),
        validarCampos
    ],
    medicosController.asociarMedicoConObraSocial
);

// No se implementa, ya que se asigna especialidad al crear el médico
// No hay tabla intermedia en este caso
/*
router.post(
    "/:id_medico/especialidades",
    [        
        param('id_medico')
            .notEmpty().withMessage('El id_medico es obligatorio.')
            .isInt().withMessage('El id_medico debe ser un número entero.'),
        check('especialidades')
            .isArray().withMessage('especialidades debe ser un array.')
            .notEmpty().withMessage('especialidades no puede estar vacío.'),
        check('especialidades.*.id_especialidad') 
            .notEmpty().withMessage('Cada especialidad debe tener id_especialidad.')
            .isInt().withMessage('id_especialidad debe ser un número entero.'),
        validarCampos
    ],
    medicosController.asociarMedicoConEspecialidad
);
*/

export default router;