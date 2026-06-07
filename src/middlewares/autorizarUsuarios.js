export default function autorizarUsuarios(perfilesAutorizados = []) {

    return (req, res, next) => {

        const usuario = req.user;

        if (!usuario || !perfilesAutorizados.includes(usuario.rol)) {
            return res.status(403).json({
                estado: false,
                mensaje: "No posee permisos para acceder a este recurso"
            });
        }

        next();
    };
}