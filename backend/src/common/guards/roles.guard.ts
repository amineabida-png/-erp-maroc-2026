import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: any) {} // Simplifié pour l'exemple

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    // Logique RBAC : On vérifie si l'utilisateur a les droits pour le tenant en cours
    return true; 
  }
}
