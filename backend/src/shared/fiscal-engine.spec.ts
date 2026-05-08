import { FiscalEngine, PaySlipInput } from './fiscal-engine';

describe('FiscalEngine', () => {
  it('should calculate payroll correctly for a simple case', () => {
    const input: PaySlipInput = {
      baseSalary: 10000,
      overtime: 0,
      bonuses: 0,
      allowances: 0,
      maritalStatus: 'single',
      childrenCount: 0
    };

    const result = FiscalEngine.calculatePayroll(input);

    // CNSS: min(10000, 6000) * 4.48% = 6000 * 0.0448 = 268.8
    expect(result.cnss).toBeCloseTo(268.8);
    // AMO: 10000 * 2.26% = 226
    expect(result.amo).toBeCloseTo(226);
    // IPE: 10000 * 0.19% = 19
    expect(result.ipe).toBeCloseTo(19);
    
    // SBI Annuel = 120000 > 78000 => Rate 25%
    // FP = min(10000 * 0.25, 2916.67) = 2500
    expect(result.professionalFees).toBeCloseTo(2500);

    // SNI = 10000 - (268.8 + 226 + 19) - 2500 = 10000 - 513.8 - 2500 = 6986.2
    expect(result.netTaxableSalary).toBeCloseTo(6986.2);

    // IR Brut (6986.2): (6986.2 * 0.30) - 1500 = 2095.86 - 1500 = 595.86
    expect(result.irBrut).toBeCloseTo(595.86);

    // Single, 0 kids => 0 deduction
    expect(result.familyDeduction).toBe(0);

    // IR Net = 595.86
    expect(result.irNet).toBeCloseTo(595.86);

    // Net Salary = 10000 - 513.8 - 595.86 = 8890.34
    expect(result.netSalary).toBeCloseTo(8890.34);
  });

  it('should calculate IS correctly', () => {
    expect(FiscalEngine.calculateIS(200000)).toBe(20000); // 10%
    expect(FiscalEngine.calculateIS(500000)).toBe(100000); // 20%
    expect(FiscalEngine.calculateIS(2000000)).toBe(620000); // 31%
  });
});
