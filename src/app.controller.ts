import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('generate-pdf')
  @Header('Content-Type', 'application/pdf')
  // @Header('Content-Disposition', 'attachment; filename=documento.pdf')
  async generatePdf() {
    return await this.appService.generatePDF();
  }
}
