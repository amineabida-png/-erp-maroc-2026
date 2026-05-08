import { Injectable, NotFoundException } from '@nestjs/common';

export interface Product {
  id: string;
  tenantId: string;
  sku: string;
  name: string;
  priceHT: number;
  tvaRate: number; // 20, 14, 10, 7, 0
  stock: number;
}

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  async create(tenantId: string, data: Partial<Product>): Promise<Product> {
    const product = {
      id: Math.random().toString(36).substr(2, 9),
      tenantId,
      sku: data.sku || `SKU-${Date.now()}`,
      name: data.name,
      priceHT: data.priceHT || 0,
      tvaRate: data.tvaRate || 20,
      stock: data.stock || 0,
    } as Product;
    this.products.push(product);
    return product;
  }

  async findOne(tenantId: string, id: string): Promise<Product> {
    const product = this.products.find(p => p.id === id && p.tenantId === tenantId);
    if (!product) throw new NotFoundException('Produit non trouvé');
    return product;
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    const product = this.products.find(p => p.id === id);
    if (product) product.stock += quantity;
  }
}
