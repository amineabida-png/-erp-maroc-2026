import { Controller, Get, UseInterceptors, Req } from '@nestjs/common';
import { AccountingJournalService } from '../journal/journal.service';
import { ChartOfAccountsService } from '../chart/chart.service';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';

@Controller('accounting')
@UseInterceptors(TenantInterceptor)
export class AccountingController {
  constructor(
    private readonly journalService: AccountingJournalService,
    private readonly chartService: ChartOfAccountsService
  ) {}

  @Get('journal')
  async getJournal(@Req() req: any) {
    return this.journalService.getJournal(req.tenantId);
  }

  @Get('chart')
  async getChart() {
    return this.chartService.getAll();
  }

  @Get('balance')
  async getBalance(@Req() req: any) {
    const entries = await this.journalService.getJournal(req.tenantId);
    const balance: Record<string, { account: string, debit: number, credit: number }> = {};

    entries.forEach(entry => {
      entry.lines.forEach(line => {
        if (!balance[line.accountCode]) {
          balance[line.accountCode] = { account: line.accountCode, debit: 0, credit: 0 };
        }
        balance[line.accountCode].debit += line.debit;
        balance[line.accountCode].credit += line.credit;
      });
    });

    return Object.values(balance);
  }
}
