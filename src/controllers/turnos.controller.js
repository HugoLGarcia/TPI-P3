import turnosService from "../services/turnos.service.js";
import informesService from "../services/informes.services.js";

const create = async (req, res) => {
  try {
    const result = await turnosService.create(req.body);

    res.status(201).json({
      estado: true,
      mensaje: "Turno creado",
      data: result
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      estado: false,
      mensaje: error.message || "Error al crear turno"
    });
  }
};

const porEspecialidad = async (req, res) => {
        try{
            const { buffer, headers } = await turnosService.porEspecialidad();
            
            // SET CABECERA DE LA RESPUESTA
            res.set(headers);
            // RETORNO EL BUFFER NO DATOS JSON.
            res.status(200).end(Buffer.from(buffer));
            
        }catch(error) {
            console.log(`Error en GET /especialidades/por-especialidad ${error}`);            
            res.status(500).json({
                'estado': false,
                'mensaje': 'Error interno'
            })    
        }
    };


export default {
  create,
  porEspecialidad
};


