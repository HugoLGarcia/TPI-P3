import jwt from "jsonwebtoken";
import usuariosService from "./usuarios.service.js";
import passport from "passport";

const login = async (email, contrasenia) => {

  const usuario = await usuariosService.buscar(email, contrasenia);

  if (!usuario) {
    throw new Error("Credenciales incorrectas");
  }

  const token = jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    usuario,
    token
  };
};

export default {
  login
};