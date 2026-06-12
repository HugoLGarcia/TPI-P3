import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/usuarios");
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    cb(null, `${Date.now()}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png"];

  if (tiposPermitidos.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(new Error("Solo se permiten imágenes JPG y PNG"));
};

const uploadUsuario = multer({
  storage,
  fileFilter,
});

export default uploadUsuario;