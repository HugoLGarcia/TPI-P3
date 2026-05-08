import express from "express";
import usuariosRoutes from "./routes/usuarios.routes.js";

const app = express();

app.use(express.json());

// rutas
app.use("/usuarios", usuariosRoutes);

app.listen(4000, () => {
  console.log("Servidor corriendo en puerto 4000");
});