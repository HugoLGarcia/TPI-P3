# TPI - Sistema de turnos para una clinica medica
Trabajo Final Integrador de **Programación III** — Tecnicatura Universitaria en Desarrollo Web (UNER), 1° cuatrimestre 2026
API del lado del servidor para una clinica medica. En esta entrega implementamos el BREAD completo de la entidad **usuarios** con arquitectura por capas y soft delete.

## Grupo T
- Valentina Nieto
- Hugo Juan Puhl
- Hugo Leonel García
- Lucas Benitez
- Candela Schenone

## Stack
Node.js 20.6+, Express, MySQL/MariaDB, mysql2/promise

## Como levantarlo
1. Clonar el repo e instalar dependencias:
   bash
   git clone https://github.com/HugoLGarcia/TPI-P3.git
   cd TPI-P3
   npm install
   
2. Copia .env.example a .env y completalo con tus datos de MySQL:
   env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=prog3_turnos
   
3. Importa prog3_turnos.sql en tu MySQL (te crea las tablas y carga datos de prueba)

4. Arrancá el servidor:
   bash
   npm start
      tiene que decir Servidor corriendo en puerto 3000

## Endpoints
Base:  http://localhost:3000 
| Método | Ruta                | Descripción                                |
| GET    |  /usuarios          | Lista todos los usuarios activos           |
| GET    |  /usuarios/buscar   | Busca por nombre o apellido                |
| GET    |  /usuarios/:id      | Obtiene un usuario por id                  |
| POST   |  /usuarios          | Crea un usuario                            |
| PUT    |  /usuarios/:id      | Actualiza un usuario                       |
| DELETE |  /usuarios/:id      | Da de baja (soft delete)                   |


### Body de ejemplo (POST / PUT)
   json
{
  "documnto": "31000111",
  "apellido": "Lopez",
  "nombres": "Marcelo",
  "email": "lopmar@correo.com",
  "contrasenia": "secreto",
  "foto_path": "",
  "rol": 1
}

Roles:  1  médico,  2  paciente,  3  administrador.
