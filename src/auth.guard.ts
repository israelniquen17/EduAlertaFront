import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const usuario = JSON.parse(user);
    const rolesPermitidos = route.data['roles'] as Array<string>;

    if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
      // Si el rol no tiene acceso, redirigir a su "home"
      switch (usuario.rol) {
        case 'DOCENTE': this.router.navigate(['/alumnos']); break;
        case 'PADRE': this.router.navigate(['/padre']); break;
        default: this.router.navigate(['/login']); break;
      }
      return false;
    }

    return true;
  }
}