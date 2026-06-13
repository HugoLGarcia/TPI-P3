import puppeteer, {Browser} from "puppeteer";
import Handlebars from "handlebars";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const reportePorEspecialidades = async (datos) => {
        const plantillaPath = path.join(__dirname, '../utils/handlebars/turnosPorEspecialidad.hbs');
        const plantillaHtml = fs.readFileSync(plantillaPath, 'utf-8');
        
        const template = Handlebars.compile(plantillaHtml);

        const html = template(
            {
                especialidades: datos
            }
        );
        

        const browser = await puppeteer.launch(
            {
            executablePath: '/snap/bin/chromium', // Reemplaza con la ruta que te arrojó el comando
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Comúnmente necesarios en Linux
  }
        );

        const pagina = await browser.newPage();
        
        await pagina.setContent(html);

        const pdf = await pagina.pdf(
            {
                format: 'A4'
            }
        );

        await browser.close();
        
        return pdf;
    };

export default {
    reportePorEspecialidades
};