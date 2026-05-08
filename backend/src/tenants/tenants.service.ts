import { Injectable } from '@nestjs/common';

export interface Tenant {
  id: string;
  name: string;
  ice: string;
  taxId: string;
}

@Injectable()
export class TenantsService {
  private tenants: Tenant[] = [];

  async create(data: Partial<Tenant>): Promise<Tenant> {
    const newTenant = {
      id: Math.random().toString(36).substr(2, 9), // Simulé, remplacé par UUID en DB
      name: data.name,
      ice: data.ice,
      taxId: data.taxId,
    } as Tenant;
    
    this.tenants.push(newTenant);
    return newTenant;
  }

  async findByIce(ice: string): Promise<Tenant | undefined> {
    return this.tenants.find(t => t.ice === ice);
  }

  async findById(id: string): Promise<Tenant | undefined> {
    return this.tenants.find(t => t.id === id);
  }
}
