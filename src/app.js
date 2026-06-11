import dotenv from "dotenv";

dotenv.config();

import express from "express";
import passport from "passport";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import especialidadesRoutes from "./routes/especialidades.routes.js";
import obrasSocialesRoutes from "./routes/obrasSociales.routes.js";
import medicosRoutes from "./routes/medicos.routes.js";
import turnosReservasRoutes from "./routes/turnosReservas.routes.js";
import pacientesRoutes from "./routes/pacientes.routes.js";
import reportesRoutes from "./routes/reportes.routes.js";

import { estrategia, validacion } from "./config/passport.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

// Middleware base
app.use(express.json());

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Passport config
passport.use("local", estrategia);
passport.use("jwt", validacion);
app.use(passport.initialize());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/usuarios", usuariosRoutes);
app.use("/api/v1/especialidades", especialidadesRoutes);
app.use("/api/v1/obras-sociales", obrasSocialesRoutes);
app.use("/api/v1/medicos", medicosRoutes);
app.use("/api/v1/turnos-reservas", turnosReservasRoutes);
app.use("/api/v1/pacientes", pacientesRoutes);
app.use("/api/v1/reportes", reportesRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res) => {
  res.status(404).json({
    estado: false,
    mensaje: "Recurso no encontrado",
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Swagger disponible en http://localhost:${PORT}/api-docs`);
});