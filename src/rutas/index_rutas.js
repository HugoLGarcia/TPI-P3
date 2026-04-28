import { Router } from 'express';
import rutasUsuarios from './rutas_usuarios.js';
import rutasPacientes from './rutas_pacientes.js';
import rutasMedicos from './rutas_medicos.js';

const router = Router();

router.use('/usuarios', rutasUsuarios);
//⏹️ No implementadas aun
//No sé si se implementan así o en algún caso dentro de otra ruta
router.use('/pacientes', rutasPacientes);
router.use('/medicos', rutasMedicos);
router.use('/obrassociales', rutasMedicos);
router.use('/especialidades', rutasMedicos);

export default router;
