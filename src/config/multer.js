import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // __dirname es la carpeta actual de este archivo.
    // Ajustá los '../' necesarios para llegar a tu carpeta public.
    cb(null, path.join(__dirname, '../public')); 
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

export{ 
    storage,
};