import { validationResult } from "express-validator";

// verificar si hay errores de validación antes de llegar al controlador
const validarCampos = (req, res, next) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array()
    });
  }

  next();
};

export default validarCampos;