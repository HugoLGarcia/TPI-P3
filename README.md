# TPI-P3 - Clínica Médica

Trabajo Final Integrador de Programación III - Tecnicatura Universitaria en Desarrollo Web - UNER.

## Integrantes

* Nieto Valentina
* Garcia Hugo
* Benitez Lucas 
* Schenone Candela
* Puhl juan

## Tecnologías utilizadas

* Node.js
* Express
* MySQL
* JWT
* Passport
* Swagger
* Multer
* Morgan
* Helmet
* Puppeteer

## Funcionalidades implementadas

### Médico

* Iniciar sesión
* Listar turnos propios
* Marcar turnos como atendidos

### Paciente

* Iniciar sesión
* Reservar turnos propios
* Listar turnos propios
* Listar especialidades
* Listar médicos
* Listar médicos por especialidad

### Administrador

* Gestionar especialidades
* Gestionar obras sociales
* Gestionar médicos
* Gestionar pacientes
* Registrar turnos
* Obtener estadísticas

## Características técnicas

* Autenticación JWT
* Autorización por roles
* API REST con Express
* Persistencia en MySQL
* Stored Procedures para estadísticas
* Generación de reportes PDF
* Documentación Swagger
* Validaciones con Express Validator
* Carga de archivos con Multer
* Registro de solicitudes con Morgan
* Seguridad con Helmet
* Configuración mediante variables de entorno

## Instalación

```bash
npm install
npm start
```

## Documentación

Swagger:

```txt
http://localhost:3000/api-docs
```

## Base de datos

Importar:

```txt
prog3_turnos.sql
```
