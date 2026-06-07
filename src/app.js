import express from "express";

import usuariosRoutesv0 from "./routes/v0/usuarios.routes.js";
import passport from "passport";

import usuariosRoutes from "./routes/usuarios.routes.js";
import authRoutes from "./routes/auth.routes.js";

import { estrategia, validacion } from "./config/passport.js";
import especialidadesRoutes from "./routes/especialidades.routes.js";

const app = express();

app.use(express.json());

// Passport
passport.use("local", estrategia);
passport.use("jwt", validacion);

app.use(passport.initialize());

// rutas versionadas
app.use("/api/v0/usuarios", usuariosRoutesv0);
app.use("/api/v0/auth", authRoutes);


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/usuarios", usuariosRoutes);
app.use(
  "/api/v1/especialidades",
  especialidadesRoutes
);

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});