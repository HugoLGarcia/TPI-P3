import express from "express";
import passport from "passport";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import usuariosRoutes from "./routes/usuarios.routes.js";
import authRoutes from "./routes/auth.routes.js";
import especialidadesRoutes from "./routes/especialidades.routes.js";

import { estrategia, validacion } from "./config/passport.js";

import obrasSocialesRoutes from "./routes/obrasSociales.routes.js";

import medicosRoutes from "./routes/medicos.routes.js";

import turnosReservasRoutes from "./routes/turnosReservas.routes.js";

import pacientesRoutes from "./routes/pacientes.routes.js";
//pdf
import reportesRoutes from "./routes/reportes.routes.js";
//estadisticas
import estadisticasRoutes from "./routes/estadisticas.routes.js";

//swagger
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

// Middlewares globales
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.static("public"));

// Passport
passport.use("local", estrategia);
passport.use("jwt", validacion);

app.use(passport.initialize());

//estadisticas
app.use("/api/v1/estadisticas", estadisticasRoutes);

// Documentacion Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas versionadas
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/usuarios", usuariosRoutes);
app.use("/api/v1/especialidades", especialidadesRoutes);

app.use("/api/v1/obras-sociales", obrasSocialesRoutes);

app.use("/api/v1/medicos", medicosRoutes);

app.use("/api/v1/turnos-reservas", turnosReservasRoutes);

app.use("/api/v1/pacientes", pacientesRoutes);
//pdf
app.use("/api/v1/reportes", reportesRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    estado: false,
    mensaje: "Recurso no encontrado",
  });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
