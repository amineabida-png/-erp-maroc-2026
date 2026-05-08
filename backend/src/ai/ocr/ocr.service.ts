import { Injectable } from '@nestjs/common';

export interface OCRResult {
  supplierName: string;
  supplierICE: string;
  invoiceNumber: string;
  date: string;
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  confidence: number;
}

@Injectable()
export class OCRService {
  /**
   * Simule l'extraction de données via IA/OCR (ex: AWS Textract, Google Document AI ou modèle local)
   */
  async processInvoice(fileBuffer: Buffer): Promise<OCRResult> {
    // Dans une implémentation réelle, nous enverrions le buffer à une API d'IA
    // Ici, nous simulons une extraction réussie pour une facture marocaine typique
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          supplierName: 'STE MAROCAINE DE NEGOCE',
          supplierICE: '001234567890123',
          invoiceNumber: 'INV-2026-99',
          date: '2026-05-01',
          totalHT: 1500.00,
          totalTVA: 300.00, // 20%
          totalTTC: 1800.00,
          confidence: 0.98,
        });
      }, 1500); // Simulation du temps de traitement IA
    });
  }

  /**
   * Analyse la validité fiscale du fournisseur (Check ICE via API DGI fictive)
   */
  async validateSupplier(ice: string): Promise<boolean> {
    // Vérification de l'ICE dans la base de données DGI
    return ice.length === 15;
  }
}
