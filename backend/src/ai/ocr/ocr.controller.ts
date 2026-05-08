import { Controller, Post, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { OCRService } from './ocr.service';
import { AccountingJournalService } from '../../accounting/journal/journal.service';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';

@Controller('ai/ocr')
@UseInterceptors(TenantInterceptor)
export class OCRController {
  constructor(
    private readonly ocrService: OCRService,
    private readonly journalService: AccountingJournalService
  ) {}

  @Post('upload-invoice')
  async uploadInvoice(@Req() req: any) {
    // Note: Dans une version réelle, on utiliserait FileInterceptor de NestJS
    // Pour cet exemple, on simule la réception d'un fichier
    const mockBuffer = Buffer.from('fake-pdf-content');
    
    // 1. Extraction IA
    const result = await this.ocrService.processInvoice(mockBuffer);
    
    // 2. Validation ICE
    const isValid = await this.ocrService.validateSupplier(result.supplierICE);

    // 3. Proposition d'écriture comptable automatique (Achat)
    // On prépare l'écriture sans la valider immédiatement (besoin de validation humaine)
    const proposedEntry = {
      tenantId: req.tenantId,
      date: new Date(result.date),
      reference: result.invoiceNumber,
      description: `Achat Fournisseur: ${result.supplierName} (IA Extracted)`,
      lines: [
        { accountCode: '6111', debit: result.totalHT, credit: 0 }, // Achats
        { accountCode: '3455', debit: result.totalTVA, credit: 0 }, // TVA Récupérable
        { accountCode: '4411', debit: 0, credit: result.totalTTC }, // Fournisseurs
      ]
    };

    return {
      extractedData: result,
      fiscalValidation: {
        iceValid: isValid,
        source: 'DGI-Lookup-Simulated'
      },
      accountingSuggestion: proposedEntry
    };
  }
}
