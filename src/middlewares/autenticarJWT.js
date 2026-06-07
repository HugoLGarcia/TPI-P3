import passport from "passport";

export default (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err, usuario) => {

      if (err) {
        return res.status(500).json({
          estado: false,
          mensaje: "Error de autenticación"
        });
      }

      if (!usuario) {
        return res.status(401).json({
          estado: false,
          mensaje: "Debe iniciar sesión para acceder a este recurso"
        });
      }

      req.user = usuario;
      next();
    }
  )(req, res, next);
};