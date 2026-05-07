import { body, validationResult } from 'express-validator';

const validarCorreoMiddleware = [
  //Reglas
  body('email')
    .trim()
    .isEmail().withMessage('Correo inválido')
    .normalizeEmail(),

  //Lógica de chequeo de errores
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: (`${errors.array()[0].msg} al ingresar correo:
       ${errors.array()[0].value}`) });
    }
    next();
  }
];

export {
    validarCorreoMiddleware
};
