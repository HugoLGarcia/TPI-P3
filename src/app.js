import express from "express";

import passport from "passport";
import { estrategia, validacion } from "./config/passport.js";

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';


import usuariosRoutesv0 from "./routes/v0/usuarios.routes.js";

import usuariosRoutes from "./routes/usuarios.routes.js";
import authRoutes from "./routes/auth.routes.js";
import especialidadesRoutes from "./routes/especialidades.routes.js";
import obrassocialesRoutes from "./routes/obrassociales.routes.js";

const app = express();

app.use(express.json());

// Passport
passport.use("local", estrategia);
passport.use("jwt", validacion);

app.use(passport.initialize());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TPI Programación 3 - Documentación API',
      version: '1.0.0',
      description: 'Documentación de la API para el Trabajo Práctico Integrador de Programación 3',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v0',
      },
    ],
  },
  // Escanea el archivo actual y cualquier archivo JS dentro de la carpeta routes
  apis: ['./app.js', './routes/*.js', './routes/**/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Interfaz gráfica de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Ejemplo de Endpoint documentado directamente en app.js
/**
 * @openapi
 * /api/status:
 *   get:
 *     summary: Verifica el estado del servidor
 *     responses:
 *       200:
 *         description: El servidor está operativo
 */
app.get('/api/status', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// rutas versionadas
app.use("/api/v0/usuarios", usuariosRoutesv0);
app.use("/api/v0/auth", authRoutes);
app.use(
  "/api/v0/especialidades",
  especialidadesRoutes
);

// rutas finales
app.use("/api/v1/usuarios", usuariosRoutes);
app.use("/api/v1/auth", authRoutes);
app.use(
  "/api/v1/especialidades",
  especialidadesRoutes
);
app.use(
  "/api/v1/obrassociales",
  obrassocialesRoutes
);

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
  console.log('Swagger disponible en http://localhost:3000/api-docs');
});