import { body, validationResult } from "express-validator";


export const validarCampos = (req, res, next) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      estado: false,
      errores: errores.array().map(err => ({
        campo: err.path,
        mensaje: err.msg
      }))
    });
  }

  next();
};


export const validarCorreo = [
  body('email')
    .trim()
    .isEmail().withMessage('Correo inválido')
    .normalizeEmail(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: (`${errors.array()[0].msg} al ingresar correo:
       ${errors.array()[0].value}`) });
    }
    next();
  }
];
