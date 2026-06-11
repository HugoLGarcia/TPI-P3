import fs from "fs/promises";
import path from "path";
import Handlebars from "handlebars";
import puppeteer from "puppeteer";

import reportesService from "../services/reportes.service.js";

const turnosPdf = async (req, res) => {
  try {
    const turnosOriginales = await reportesService.getTurnosParaPdf();

    const turnos = turnosOriginales.map((turno) => {
      const fecha = new Date(turno.fecha_hora);

      return {
        ...turno,

        fecha: fecha.toLocaleDateString("es-AR"),

        hora: fecha.toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });
    const templatePath = path.resolve("src/templates/reportes/turnos.html");

    const templateHtml = await fs.readFile(templatePath, "utf-8");
    const template = Handlebars.compile(templateHtml);

    const html = template({
      fechaGeneracion: new Date().toLocaleString("es-AR"),
      cantidadTurnos: turnos.length,
      turnos,
    });

    const browser = await puppeteer.launch({
      headless: "new",
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=reporte-turnos.pdf");

    return res.send(pdf);
  } catch (error) {
    console.error("Error generando PDF", error);

    return res.status(500).json({
      estado: false,
      mensaje: "Error generando PDF",
    });
  }
};

export default {
  turnosPdf,
};
