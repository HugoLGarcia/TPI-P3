import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

import usuariosService from "../services/usuarios.service.js";

const estrategia = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "contrasenia"
  },
  async (email, contrasenia, done) => {
    try {

      const usuario = await usuariosService.buscar(
        email,
        contrasenia
      );

      if (!usuario) {
        return done(null, false, {
          mensaje: "Login incorrecto"
        });
      }

      return done(null, usuario);

    } catch (error) {
      done(error);
    }
  }
);

const validacion = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  async (jwtPayload, done) => {

    try {

      const usuario = await usuariosService.getById(
        jwtPayload.id_usuario
      );

      if (!usuario) {
        return done(null, false);
      }

      return done(null, usuario);

    } catch (error) {
      done(error);
    }
  }
);

export { estrategia, validacion };