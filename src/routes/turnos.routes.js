import { Router } from "express";
import { body, param } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";
import turnosController from "../controllers/turnos.controller.js";
import passport from "passport";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import autenticarJWT from "../middlewares/autenticarJWT.js";

const router = Router();

router.post(
    "/",
    [        
        check('id_medico')
            .notEmpty().withMessage('El id_medico es obligatorio.')
            .isInt().withMessage('El id_medico debe ser un número entero.'),
        check('id_paciente')
            .notEmpty().withMessage('El id_paciente es obligatorio.')
            .isInt().withMessage('El id_paciente debe ser un número entero.'),
        check('fecha_hora')
            .notEmpty().withMessage('La fecha y hora son obligatorias.'), 
        validarCampos
    ],
    turnosController.crearTurno
);

export default router;