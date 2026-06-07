import jwt from "jsonwebtoken";
import passport from "passport";

const login = async (req, res) => {

  passport.authenticate(
    "local",
    { session: false },
    (err, usuario) => {

      if (err || !usuario) {
        return res.status(401).json({
          estado: false,
          mensaje: "Credenciales incorrectas"
        });
      }

      req.login(usuario, { session: false }, (error) => {

        if (error) {
          return res.status(500).json({
            estado: false,
            mensaje: "Error interno"
          });
        }

        const token = jwt.sign(
          usuario,
          process.env.JWT_SECRET,
          {
            expiresIn: "1h"
          }
        );

        return res.json({
          estado: true,
          token
        });

      });

    }
  )(req, res);

};

export default {
  login
};