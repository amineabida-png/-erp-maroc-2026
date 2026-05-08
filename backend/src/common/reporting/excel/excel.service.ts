import { Injectable } from '@nestjs/common';

@Injectable()
export class ExcelExportService {
  /**
   * Génère un CSV formaté pour Excel pour la balance comptable
   */
  async generateBalanceExcel(balanceData: any[]): Promise<string> {
    const headers = ['Code Compte', 'Libellé Compte', 'Débit (DH)', 'Crédit (DH)', 'Solde (DH)'];
    
    const rows = balanceData.map(item => {
      const solde = item.debit - item.credit;
      return [
        item.account,
        item.name || 'Compte Général',
        item.debit.toFixed(2),
        item.credit.toFixed(2),
        solde.toFixed(2)
      ].join(';');
    });

    return [headers.join(';'), ...rows].join('\n');
  }
}
