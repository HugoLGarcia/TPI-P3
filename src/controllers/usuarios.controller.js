import usuariosService from "../services/usuarios.service.js";

// Obtener todos los usuarios
const getAll = async (req, res) => {
  try {
    const data = await usuariosService.getAll();

    res.status(200).json({
      estado: true,
      usuarios: data
    });

  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener usuarios"
    });
  }
};

// Obtener usuario por ID
const getById = async (req, res) => {
  try {
    const data = await usuariosService.getById(req.params.id);

    if (!data) {
      return res.status(404).json({
        estado: false,
        mensaje: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      estado: true,
      usuario: data
    });

  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener usuario"
    });
  }
};

// Obtener paciente por ID
const getPacienteById = async (req, res) => {
  try {
    const data = await usuariosService.getPacienteById(req.params.id);

    if (!data) {
      return res.status(404).json({
        estado: false,
        mensaje: "Paciente no encontrado"
      });
    }

    res.status(200).json({
      estado: true,
      usuario: data
    });

  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener paciente"
    });
  }
};

// Crear usuario
const create = async (req, res) => {
  try {
    const result = await usuariosService.create(req.body);

    res.status(201).json({
      estado: true,
      mensaje: "Usuario creado",
      data: result
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      estado: false,
      mensaje: "Error al crear usuario"
    });
  }
};

// Actualizar usuario
const update = async (req, res) => {
  try {
    
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        estado: false,
        mensaje: "No hay campos para actualizar"
      });
    }

    const result = await usuariosService.update(req.params.id, req.body);

    res.status(200).json({
      estado: true,
      data: result
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      estado: false,
      mensaje: "Error al actualizar usuario"
    });
  }
};

// Actualizar usuario con imagen multer
const update2 = async (req, res) => {
  try {
    const datosActualizar = { ...req.body };

    // 2. Si Multer atrapó un archivo, lo sumamos al objeto
    if (req.file) {
      datosActualizar.foto_path = req.file.filename; 
    }

    if (Object.keys(datosActualizar).length === 0) {
      return res.status(400).json({
        estado: false,
        mensaje: "No hay campos para actualizar"
      });
    }

    const result = await usuariosService.update(req.params.id, datosActualizar);

    return res.status(200).json({
      estado: true,
      mensaje: "Usuario actualizado correctamente",
      foto_actualizada: datosActualizar.foto_path || null
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      estado: false,
      mensaje: "Error al actualizar usuario"
    });
  }
};

// Eliminar usuario
const remove = async (req, res) => {
  try {
    const result = await usuariosService.remove(req.params.id);

    res.status(200).json({
      estado: true,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al eliminar usuario"
    });
  }
};

// Buscar usuarios por apellido o nombre
const search = async (req, res) => {
  try {
    const { texto } = req.query;

    if (!texto) {
      return res.status(400).json({
        error: "Debe ingresar un texto de búsqueda"
      });
    }

    const data = await usuariosService.search(texto);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar usuarios" });
  }
};

export default {
  getAll,
  getById,
  getPacienteById,
  create,
  update,
  update2,
  remove,
  search
};