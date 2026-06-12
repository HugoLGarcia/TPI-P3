import app from './turnero.js';

process.loadEnvFile();

app.listen(process.env.Puerto || 3000, () => {
  console.log("Servidor corriendo en puerto 3000");
  console.log('Swagger disponible en http://localhost:3000/api-docs');
});