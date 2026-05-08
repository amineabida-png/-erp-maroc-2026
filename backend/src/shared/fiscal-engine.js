/**
 * Moteur Fiscal Marocain 2026 - Version Simple JS
 */

class FiscalEngine {
  static calculatePayroll(input) {
    const { baseSalary, overtime, bonuses, allowances, childrenCount, maritalStatus } = input;
    
    const grossSalary = baseSalary + overtime + bonuses + allowances;
    const cnssPlafond = 6000;
    const cnss = Math.min(grossSalary, cnssPlafond) * 0.0448;
    const amo = grossSalary * 0.0226;
    const ipe = grossSalary * 0.0019;

    const taxableGrossSalary = grossSalary;
    const annualSBI = taxableGrossSalary * 12;
    const fpRate = annualSBI <= 78000 ? 0.35 : 0.25;
    const professionalFees = Math.min(taxableGrossSalary * fpRate, 2916.67);

    const netTaxableSalary = Math.max(0, taxableGrossSalary - (cnss + amo + ipe) - professionalFees);

    const irBrut = this.calculateIR(netTaxableSalary);
    const familyDeduction = Math.min(childrenCount + (maritalStatus === 'married' ? 1 : 0), 6) * (600 / 12);
    const irNet = Math.max(0, irBrut - familyDeduction);

    const netSalary = grossSalary - (cnss + amo + ipe) - irNet;

    return {
      grossSalary,
      cnss,
      amo,
      ipe,
      irNet,
      netSalary: Math.round(netSalary * 100) / 100
    };
  }

  static calculateIR(sni) {
    if (sni <= 3333.33) return 0;
    if (sni <= 5000) return (sni * 0.10) - 333.33;
    if (sni <= 6666.67) return (sni * 0.20) - 833.33;
    if (sni <= 8333.33) return (sni * 0.30) - 1500;
    if (sni <= 15000) return (sni * 0.34) - 1833.33;
    return (sni * 0.37) - 2283.33;
  }

  static calculateTVA(amountHT, rate) {
    return amountHT * (rate / 100);
  }
}

module.exports = { FiscalEngine };
