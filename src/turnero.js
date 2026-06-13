import express from "express";

import fs from "fs";
import morgan from "morgan";

import helmet from "helmet";

import passport from "passport";
import { estrategia, validacion } from "./config/passport.js";

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import cors from "cors";

import usuariosRoutesv0 from "./routes/v0/usuarios.routes.js";

import usuariosRoutes from "./routes/usuarios.routes.js";
import authRoutes from "./routes/auth.routes.js";
import especialidadesRoutes from "./routes/especialidades.routes.js";
import obrassocialesRoutes from "./routes/obrassociales.routes.js";
import medicosRoutes from "./routes/medicos.routes.js";
import turnosRoutes from "./routes/turnos.routes.js";

import { testConexion } from "./db/connection/test-connection.js";

const app = express();

app.use(helmet());

await testConexion();

let log = fs.createWriteStream('./accesos.log', { 
    //flags: 'a'
    flags: 'w' // Sobrescribe el archivo en cada ejecución
});

app.use(morgan('dev'));
app.use(morgan('combined', {stream: log}));

//app.use(cors());

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
  apis: ['./turnero.js', './routes/*.js', './routes/**/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Interfaz gráfica de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Ejemplo de Endpoint documentado directamente en turnero.js
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

app.use(
  "/api/v1/medicos",
  medicosRoutes
);

app.use(
  "/api/v1/turnos",
  turnosRoutes
);

export default app;