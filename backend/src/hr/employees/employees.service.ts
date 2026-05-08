import { Injectable, NotFoundException } from '@nestjs/common';

export interface Employee {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  cin: string;
  cnssNumber: string;
  maritalStatus: 'single' | 'married';
  childrenCount: number;
  baseSalary: number;
  department: string;
  isActive: boolean;
}

@Injectable()
export class EmployeesService {
  private employees: Employee[] = [];

  async create(tenantId: string, data: Partial<Employee>): Promise<Employee> {
    const employee = {
      id: Math.random().toString(36).substr(2, 9),
      tenantId,
      ...data,
      isActive: true,
    } as Employee;
    this.employees.push(employee);
    return employee;
  }

  async findAll(tenantId: string): Promise<Employee[]> {
    return this.employees.filter(e => e.tenantId === tenantId);
  }

  async findOne(tenantId: string, id: string): Promise<Employee> {
    const employee = this.employees.find(e => e.id === id && e.tenantId === tenantId);
    if (!employee) throw new NotFoundException('Employé non trouvé');
    return employee;
  }
}
