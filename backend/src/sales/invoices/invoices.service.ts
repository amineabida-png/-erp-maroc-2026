import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { FiscalEngine } from '../../../shared/fiscal-engine';

export interface InvoiceItem {
  productId: string;
  quantity: number;
  unitPriceHT: number;
  tvaRate: number;
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
}

export interface Invoice {
  id: string;
  tenantId: string;
  customerId: string;
  number: string;
  date: Date;
  items: InvoiceItem[];
  subTotalHT: number;
  totalTVA: number;
  totalTTC: number;
  stampDuty: number; // Timbre fiscal si paiement espèce
  grandTotal: number;
}

@Injectable()
export class InvoicesService {
  private invoices: Invoice[] = [];
  private invoiceCounter = 1;

  constructor(private readonly productsService: ProductsService) {}

  async create(tenantId: string, customerId: string, itemsData: { productId: string; quantity: number }[], paymentMethod: 'cash' | 'transfer' = 'transfer'): Promise<Invoice> {
    let subTotalHT = 0;
    let totalTVA = 0;
    const items: InvoiceItem[] = [];

    for (const item of itemsData) {
      const product = await this.productsService.findOne(tenantId, item.productId);
      const itemHT = product.priceHT * item.quantity;
      const itemTVA = FiscalEngine.calculateTVA(itemHT, product.tvaRate);
      
      items.push({
        productId: product.id,
        quantity: item.quantity,
        unitPriceHT: product.priceHT,
        tvaRate: product.tvaRate,
        totalHT: itemHT,
        totalTVA: itemTVA,
        totalTTC: itemHT + itemTVA,
      });

      subTotalHT += itemHT;
      totalTVA += itemTVA;

      // Mise à jour du stock (Décrémentation)
      await this.productsService.updateStock(product.id, -item.quantity);
    }

    const totalTTC = subTotalHT + totalTVA;
    
    // Calcul du timbre fiscal (0.25% si cash, max 250 DH)
    let stampDuty = 0;
    if (paymentMethod === 'cash') {
      stampDuty = Math.min(totalTTC * 0.0025, 250);
    }

    const invoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      tenantId,
      customerId,
      number: `FAC-${new Date().getFullYear()}-${String(this.invoiceCounter++).padStart(5, '0')}`,
      date: new Date(),
      items,
      subTotalHT,
      totalTVA,
      totalTTC,
      stampDuty,
      grandTotal: totalTTC + stampDuty,
    };

    this.invoices.push(invoice);
    return invoice;
  }

  async findAll(tenantId: string): Promise<Invoice[]> {
    return this.invoices.filter(i => i.tenantId === tenantId);
  }
}
