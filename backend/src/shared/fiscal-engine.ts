/**
 * Moteur Fiscal Marocain 2026
 * Conforme aux lois de finances 2026.
 */

export interface PaySlipInput {
  baseSalary: number;
  overtime: number;
  bonuses: number;
  allowances: number; // Indemnités
  maritalStatus: 'single' | 'married';
  childrenCount: number;
}

export interface PaySlipResult {
  grossSalary: number;
  taxableGrossSalary: number;
  cnss: number;
  amo: number;
  ipe: number;
  professionalFees: number;
  netTaxableSalary: number;
  irBrut: number;
  familyDeduction: number;
  irNet: number;
  netSalary: number;
}

export class FiscalEngine {
  // --- PAIE MAROC 2026 ---

  static calculatePayroll(input: PaySlipInput): PaySlipResult {
    const { baseSalary, overtime, bonuses, allowances, childrenCount } = input;
    
    // 1. Salaire Brut (SB)
    const grossSalary = baseSalary + overtime + bonuses + allowances;

    // 2. Cotisations Sociales (Plafonds 2026)
    const cnssPlafond = 6000;
    const cnss = Math.min(grossSalary, cnssPlafond) * 0.0448;
    const amo = grossSalary * 0.0226;
    const ipe = grossSalary * 0.0019;

    // 3. Salaire Brut Imposable (SBI)
    // On suppose que les allowances sont imposables sauf cas spécifiques (non gérés ici pour simplification)
    const taxableGrossSalary = grossSalary;

    // 4. Frais Professionnels (FP)
    // Barème 2026 : 35% si <= 78000 DH/an (6500/mois), 25% si > 78000 DH/an
    // Plafond mensuel : 2916.67 DH (35000/12)
    const annualSBI = taxableGrossSalary * 12;
    const fpRate = annualSBI <= 78000 ? 0.35 : 0.25;
    const professionalFees = Math.min(taxableGrossSalary * fpRate, 2916.67);

    // 5. Salaire Net Imposable (SNI)
    const netTaxableSalary = Math.max(0, taxableGrossSalary - (cnss + amo + ipe) - professionalFees);

    // 6. IR Brut (Barème Mensuel 2026)
    const irBrut = this.calculateIR(netTaxableSalary);

    // 7. Charges de Famille
    // 30 DH par personne par mois (360 DH/an), max 6 personnes
    const familyDeduction = Math.min(childrenCount + (input.maritalStatus === 'married' ? 1 : 0), 6) * (600 / 12);

    // 8. IR Net
    const irNet = Math.max(0, irBrut - familyDeduction);

    // 9. Salaire Net
    const netSalary = grossSalary - (cnss + amo + ipe) - irNet;

    return {
      grossSalary,
      taxableGrossSalary,
      cnss,
      amo,
      ipe,
      professionalFees,
      netTaxableSalary,
      irBrut,
      familyDeduction,
      irNet,
      netSalary
    };
  }

  private static calculateIR(sni: number): number {
    // Barème Mensuel 2026
    if (sni <= 3333.33) return 0;
    if (sni <= 5000) return (sni * 0.10) - 333.33;
    if (sni <= 6666.67) return (sni * 0.20) - 833.33;
    if (sni <= 8333.33) return (sni * 0.30) - 1500;
    if (sni <= 15000) return (sni * 0.34) - 1833.33;
    return (sni * 0.37) - 2283.33;
  }

  // --- TVA MAROC 2026 ---

  static calculateTVA(amountHT: number, rate: number): number {
    return amountHT * (rate / 100);
  }

  // --- IS MAROC 2026 ---

  static calculateIS(annualProfit: number): number {
    if (annualProfit <= 300000) return annualProfit * 0.10;
    if (annualProfit <= 1000000) return annualProfit * 0.20;
    return annualProfit * 0.31;
  }
}
