import { Injectable } from '@nestjs/common';
import { EmployeesService } from '../employees/employees.service';
import { FiscalEngine, PaySlipResult } from '../../shared/fiscal-engine';

export interface PaySlipRecord extends PaySlipResult {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  createdAt: Date;
}

@Injectable()
export class PayrollService {
  private paySlips: PaySlipRecord[] = [];

  constructor(private readonly employeesService: EmployeesService) {}

  async generateMonthlyPayroll(tenantId: string, month: number, year: number) {
    const employees = await this.employeesService.findAll(tenantId);
    const generatedSlips: PaySlipRecord[] = [];

    for (const employee of employees) {
      if (!employee.isActive) continue;

      // Utilisation du moteur fiscal pour le calcul exact Maroc 2026
      const calculation = FiscalEngine.calculatePayroll({
        baseSalary: employee.baseSalary,
        overtime: 0, // À récupérer des feuilles de temps plus tard
        bonuses: 0,
        allowances: 0,
        maritalStatus: employee.maritalStatus,
        childrenCount: employee.childrenCount,
      });

      const paySlip: PaySlipRecord = {
        id: Math.random().toString(36).substr(2, 9),
        employeeId: employee.id,
        month,
        year,
        ...calculation,
        createdAt: new Date(),
      };

      this.paySlips.push(paySlip);
      generatedSlips.push(paySlip);
    }

    return {
      count: generatedSlips.length,
      totalNet: generatedSlips.reduce((sum, s) => sum + s.netSalary, 0),
      slips: generatedSlips,
    };
  }

  async getEmployeePaySlips(employeeId: string): Promise<PaySlipRecord[]> {
    return this.paySlips.filter(s => s.employeeId === employeeId);
  }
}
