import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // Dans un vrai SaaS, le tenant_id est extrait du JWT ou d'un header X-Tenant-ID
    // Pour l'isolation RLS, nous l'attachons à l'objet request
    const tenantId = request.headers['x-tenant-id'] || request.user?.tenantId;

    if (!tenantId) {
      // Pour les routes publiques (login, register), on laisse passer
      return next.handle();
    }

    request.tenantId = tenantId;
    return next.handle();
  }
}
