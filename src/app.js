import express from "express";
import usuariosRoutes from "./routes/usuarios.routes.js";

const app = express();

app.use(express.json());

app.use("/usuarios", usuariosRoutes);


app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});