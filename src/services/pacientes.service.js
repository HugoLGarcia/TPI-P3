import pacientesRepository from "../repositories/pacientes.repository.js";

class PacientesService {

    async getById(id) {
        return await pacientesRepository.getById(id);
    }

}

export default new PacientesService();