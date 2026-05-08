import { Controller, Post, Get, Body, Param, Query, UseInterceptors, Req } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';

@Controller('hr/payroll')
@UseInterceptors(TenantInterceptor)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('generate')
  async generate(@Req() req: any, @Body() body: { month: number; year: number }) {
    const tenantId = req.tenantId;
    return this.payrollService.generateMonthlyPayroll(tenantId, body.month, body.year);
  }

  @Get('employee/:id')
  async getEmployeeSlips(@Param('id') id: string) {
    return this.payrollService.getEmployeePaySlips(id);
  }
}
