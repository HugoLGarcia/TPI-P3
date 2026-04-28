import express from 'express';
import apiRoutes from './rutas/rutas_usuarios.js';
import 'dotenv/config';

const app = express();

//Importamos la función para testeo de conexión a bd
import { testConexion } from './db/conexion/test-conexion.js';

// TEST BASE DE DATOS
//⚠️ Tal cual al tp
await testConexion();
app.use(express.json());

app.use('/', apiRoutes);

process.loadEnvFile();
const port = process.env.Puerto || 3000;

app.listen(port, () => console.log(`Servidor iniciado en el puerto ${port}`))
