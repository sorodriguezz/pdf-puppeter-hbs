import { Injectable, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { Readable } from 'stream';

@Injectable()
export class AppService {
  async generatePDF(): Promise<any> {
    // Lee la plantilla
    const templateHtml = fs.readFileSync('views/template.hbs', 'utf8');

    // renderiza la plantilla con hbs
    const template = handlebars.compile(templateHtml);

    // Crear datos para la plantilla
    const data = {
      title: 'Mi Documento PDF',
      header: 'Hola Mundo',
      message: 'Este es un documento PDF generado con Handlebars y Puppeteer',
    };

    // Crear HTML final
    const finalHtml = template(data);

    // Configurar Puppeteer
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(finalHtml);

    // Crear PDF
    const pdfOptions: puppeteer.PDFOptions = {
      path: 'documento.pdf',
      format: 'A4',
      margin: {
        top: '1in',
        right: '1in',
        bottom: '1in',
        left: '1in',
      },
      printBackground: true, // Esto asegura que el fondo de la página se imprima
    };
    const pdfBuffer = await page.pdf(pdfOptions);

    const stream: Readable = new Readable();
    stream.push(pdfBuffer);
    stream.push(null);

    const streamableFile: StreamableFile = new StreamableFile(stream);

    // Cerrar Puppeteer
    await browser.close();
    return streamableFile;
  }
}
