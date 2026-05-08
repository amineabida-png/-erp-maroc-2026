import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { TenantsService } from '../tenants/tenants.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post('register')
  async register(@Body() registerDto: any) {
    // 1. Créer le Tenant (Entreprise)
    const tenant = await this.tenantsService.create({
      name: registerDto.companyName,
      ice: registerDto.ice,
    });

    // 2. Créer l'utilisateur Admin
    // (Logic de création user à implémenter)

    return {
      message: 'Entreprise enregistrée avec succès',
      tenantId: tenant.id,
    };
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    // Simulation de login JWT
    return {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Mock JWT
      user: {
        email: loginDto.email,
        role: 'admin',
      }
    };
  }
}
