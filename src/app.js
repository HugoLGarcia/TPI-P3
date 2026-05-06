import express from "express";
import cors from "cors";
import helmet from "helmet";
import usuariosRoutes from "./routes/usuarios.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// rutas
app.use("/usuarios", usuariosRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});

/*
Chicos ya agrege la parte de corse helmet,
el cors permite que el frontend pueda hacer peticiones al backend sin problemas de seguridad,
y el helmet agrega cabeceras de seguridad para proteger la app de ataques comunes.
*/