import { Injectable } from '@nestjs/common';

export interface Account {
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
}

@Injectable()
export class ChartOfAccountsService {
  // Sélection du Plan Comptable Général Marocain (PCGM)
  private readonly pcm: Account[] = [
    // Classe 3 : Comptes d'actif circulant
    { code: '3421', name: 'Clients', type: 'Asset' },
    { code: '3455', name: 'État, TVA récupérable', type: 'Asset' },
    
    // Classe 4 : Comptes de passif circulant
    { code: '4411', name: 'Fournisseurs', type: 'Liability' },
    { code: '4432', name: 'Rémunérations dues au personnel', type: 'Liability' },
    { code: '4441', name: 'CNSS', type: 'Liability' },
    { code: '4455', name: 'État, TVA facturée', type: 'Liability' },
    { code: '4456', name: 'État, impôts sur le revenu', type: 'Liability' },
    
    // Classe 5 : Comptes de Trésorerie
    { code: '5141', name: 'Banques', type: 'Asset' },
    { code: '5161', name: 'Caisse', type: 'Asset' },

    // Classe 6 : Comptes de charges
    { code: '6111', name: 'Achats de marchandises', type: 'Expense' },
    { code: '6171', name: 'Rémunérations du personnel', type: 'Expense' },
    { code: '6174', name: 'Charges sociales', type: 'Expense' },

    // Classe 7 : Comptes de produits
    { code: '7111', name: 'Ventes de marchandises', type: 'Revenue' },
    { code: '7121', name: 'Ventes de biens et services produits', type: 'Revenue' },
  ];

  async getAccount(code: string): Promise<Account | undefined> {
    return this.pcm.find(a => a.code === code);
  }

  async getAll(): Promise<Account[]> {
    return this.pcm;
  }
}
