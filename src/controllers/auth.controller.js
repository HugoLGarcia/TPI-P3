import authService from "../services/auth.service.js";

const login = async (req, res) => {
  try {
    const { email, contrasenia } = req.body;

    const result = await authService.login(email, contrasenia);

    return res.json({
      estado: true,
      token: result.token,
      usuario: result.usuario
    });

  } catch (error) {
    return res.status(401).json({
      estado: false,
      mensaje: error.message
    });
  }
};

export default { login };