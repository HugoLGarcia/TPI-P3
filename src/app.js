import express from "express";
import passport from "passport";

import usuariosRoutes from "./routes/usuarios.routes.js";
import authRoutes from "./routes/auth.routes.js";

import { estrategia, validacion } from "./config/passport.js";
import especialidadesRoutes from "./routes/especialidades.routes.js";

import obrasSocialesRoutes from "./routes/obrasSociales.routes.js";

import medicosRoutes from "./routes/medicos.routes.js";

import turnosReservasRoutes from "./routes/turnosReservas.routes.js";

const app = express();

app.use(express.json());

// Passport
passport.use("local", estrategia);
passport.use("jwt", validacion);

app.use(passport.initialize());

// rutas versionadas
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/usuarios", usuariosRoutes);
app.use(
  "/api/v1/especialidades",
  especialidadesRoutes
);

app.use("/api/v1/obras-sociales", obrasSocialesRoutes);

app.use("/api/v1/medicos", medicosRoutes);

app.use(
  "/api/v1/turnos-reservas",
  turnosReservasRoutes
);

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});