import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TPI-P3 API",
      version: "1.0.0",
      description: "API REST para sistema de turnos médicos",
    },

    servers: [
      {
        url: "http://localhost:3000/api/v1",
      },
    ],

    tags: [
      {
        name: "Auth",
        description: "Autenticación de usuarios",
      },
      {
        name: "Usuarios",
        description: "Gestión de usuarios",
      },
      {
        name: "Pacientes",
        description: "Gestión de pacientes",
      },
      {
        name: "Médicos",
        description: "Gestión de médicos",
      },
      {
        name: "Especialidades",
        description: "Gestión de especialidades",
      },
      {
        name: "Turnos",
        description: "Gestión de turnos",
      },
      {
        name: "Obras Sociales",
        description: "Gestión de obras sociales",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;