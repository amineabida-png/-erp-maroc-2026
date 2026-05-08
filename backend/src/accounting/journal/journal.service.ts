import { Injectable } from '@nestjs/common';
import { Invoice } from '../../sales/invoices/invoices.service';
import { PaySlipRecord } from '../../hr/payroll/payroll.service';

export interface JournalEntry {
  id: string;
  tenantId: string;
  date: Date;
  reference: string;
  description: string;
  lines: JournalLine[];
}

export interface JournalLine {
  accountCode: string;
  debit: number;
  credit: number;
}

@Injectable()
export class AccountingJournalService {
  private entries: JournalEntry[] = [];

  // 1. Génération automatique de l'écriture de vente
  async recordInvoice(invoice: Invoice): Promise<JournalEntry> {
    const entry: JournalEntry = {
      id: Math.random().toString(36).substr(2, 9),
      tenantId: invoice.tenantId,
      date: invoice.date,
      reference: invoice.number,
      description: `Facture client ${invoice.number}`,
      lines: [
        // Débit : Client (TTC)
        { accountCode: '3421', debit: invoice.grandTotal, credit: 0 },
        // Crédit : Ventes (HT)
        { accountCode: '7111', debit: 0, credit: invoice.subTotalHT },
        // Crédit : TVA facturée
        { accountCode: '4455', debit: 0, credit: invoice.totalTVA },
      ]
    };

    // Si timbre fiscal
    if (invoice.stampDuty > 0) {
        entry.lines.push({ accountCode: '4452', debit: 0, credit: invoice.stampDuty }); // État, droits de timbre
    }

    this.entries.push(entry);
    return entry;
  }

  // 2. Génération automatique de l'écriture de paie
  async recordPaySlip(slip: PaySlipRecord, tenantId: string): Promise<JournalEntry> {
    const entry: JournalEntry = {
      id: Math.random().toString(36).substr(2, 9),
      tenantId,
      date: new Date(),
      reference: `PAIE-${slip.month}-${slip.year}`,
      description: `Paie employé ID ${slip.employeeId} - ${slip.month}/${slip.year}`,
      lines: [
        // Débit : Rémunérations du personnel (Salaire Brut)
        { accountCode: '6171', debit: slip.grossSalary, credit: 0 },
        // Crédit : CNSS (Part salariée)
        { accountCode: '4441', debit: 0, credit: slip.cnss + slip.amo + slip.ipe },
        // Crédit : État, IR (Retenue à la source)
        { accountCode: '4456', debit: 0, credit: slip.irNet },
        // Crédit : Rémunérations dues (Salaire Net)
        { accountCode: '4432', debit: 0, credit: slip.netSalary },
      ]
    };

    this.entries.push(entry);
    return entry;
  }

  async getJournal(tenantId: string): Promise<JournalEntry[]> {
    return this.entries.filter(e => e.tenantId === tenantId);
  }
}
