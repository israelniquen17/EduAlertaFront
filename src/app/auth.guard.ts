import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route) => {

  const router = inject(Router);

  const userString = localStorage.getItem('user');
  if (!userString) {
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  const user = JSON.parse(userString);

  const allowedRoles = route.data?.['roles'];

  // Si la ruta tiene roles definidos
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  return true;
};