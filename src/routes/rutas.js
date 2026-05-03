// En este archivo solo quedaron dos rutas de pruebas obsoletas
// Las otras (válidas) fueron a rutas_usuarios.js

//Importamos consultas
/*
import {getAllUsuarios, getUsuarioById, getUsuariosByApellido,
     agregarUnUsuario, borrarUsuarioPorId,
      modificarUsuarioPorId, modificarCorreoUsuarioPorId,
       estadoUsuarioById, cambiarEstadoUsuarioById, agregarUnUsuarioPaciente,
        agregarUnUsuarioMedico} from '../db/consultas/usuarios_consultas.js';
*/

//Rutas
app.get('/', (req, res) => {
    /*
    res.type('text/plain');
    res.status(200);
    res.send('Hola soy una app Express para tus turnos!!');
    */
    //Respuesta con HTML
    res.type('text/html');
    res.status(200);
    res.send(`<html>
    <head></head>
    <body><h1>🏠 Hola soy una app Express!!!!!</h1>
    <h2>🏥 Voy a gestionar la clínica!!! 🏥</h2>
    <ul>
        <li><a href="/">Inicio</a></li>
        <li><a href="/usuarios">Usuarios</a></li>
        <li><a href="/contacto">Contacto</a></li>
    </ul>
    </body>
    </html>`);
    
});

app.get('/institucional', (req, res) => {
    res.type('text/plain');
    res.status(200);
    res.send('🏢 Institucional');
});

