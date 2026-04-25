import express from 'express';

//Importamos la función para testeo de conexión a bd
import { testConexion } from './db/conexion/test-conexion.js';

//Importamos consultas
import {getAllUsuarios, getUsuarioById, getUsuariosByApellido, agregarUnUsuario} from './db/consultas/usuarios_consultas.js';

// TEST BASE DE DATOS
//⚠️ Tal cual al tp
await testConexion();

const app = express();

const port = process.env.Puerto || 3000;

app.use(express.json());


//Rutas
app.get('/', (req, res) => {
    /*
    res.type('text/plain');
    res.status(200);
    res.send('Hola soy una app Express!!');
    */
    //Respuesta con HTML
    res.type('text/html');
    res.status(200);
    res.send(`<html>
    <head></head>
    <body><h1>🏠 Hola soy una app Express!!!!!</h1>
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


app.get('/usuarios', (req, res) => {
    getAllUsuarios()
        .then(usuarios => {
            res.json(usuarios);
        })
        .catch(err => {
            console.error('Error fetching usuarios:', err);
            res.status(500).json({ error: 'Error fetching usuarios' });
        });
});

app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    getUsuarioById(id)
        .then(usuario => {
            if (usuario) {
                res.json(usuario);
            } else {
                res.status(404).json({ error: 'Usuario not found' });
            }
        })
        .catch(err => {
            console.error('Error fetching usuario:', err);
            res.status(500).json({ error: 'Error fetching usuario' });
        });
});

app.get('/usuariosapellido/:apellido', (req, res) => {
    const { apellido } = req.params;
    getUsuariosByApellido(apellido)
        .then(usuarios => {
            if (usuarios && usuarios.length > 0) {
                res.json(usuarios);
            } else {
                res.status(404).json({ error: 'Usuario not found' });
            }
        })
        .catch(err => {
            console.error('Error fetching usuario:', err);
            res.status(500).json({ error: 'Error fetching usuario' });
        });
});
      
app.post('/usuarios', (req, res) => {
    agregarUnUsuario(req.body)
        .then(result => {
            // ⚠️ Aunque no funcione Bruno da 201
            res.status(201).json(result);
        })
        .catch(err => {
            console.error('Error creating usuario:', err);
            res.status(500).json({ error: 'Error creating usuario' });
        });
});

app.listen(port, () => console.log(`Servidor iniciado en el puerto ${port}`))
