import { Controller, Post, Get, Body, UseInterceptors, Req } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';

@Controller('sales/invoices')
@UseInterceptors(TenantInterceptor)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  async create(@Req() req: any, @Body() body: { customerId: string; items: { productId: string; quantity: number }[]; paymentMethod?: 'cash' | 'transfer' }) {
    const tenantId = req.tenantId;
    return this.invoicesService.create(tenantId, body.customerId, body.items, body.paymentMethod);
  }

  @Get()
  async findAll(@Req() req: any) {
    const tenantId = req.tenantId;
    return this.invoicesService.findAll(tenantId);
  }
}
