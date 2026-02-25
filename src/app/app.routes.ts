import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout'; 
import { DashboardComponent } from './components/dashboard/dashboard';
import { AlumnoListComponent } from './components/alumno-list/alumno-list';
import { QrScannerComponent } from './components/qr-scanner/qr-scanner';
import { AlumnoQrComponent } from './components/alumno-qr/alumno-qr';
import { Login } from './components/login/login';
import { DocenteComponent } from './components/docente/docente';
import { CursoComponent } from './components/curso/curso';
import { authGuard } from './auth.guard';
import { PadreComponent } from './components/padre/padre';
import { AlumnoFormComponent } from './components/alumno-form/alumno-form';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      // Solo ADMIN
      { path: 'dashboard', component: DashboardComponent, data: { roles: ['ADMIN'] } },
      { path: 'crear-alumno', component: AlumnoFormComponent, data: { roles: ['ADMIN'] } },
      { path: 'alumnos', component: AlumnoListComponent, data: { roles: ['ADMIN','DOCENTE'] } },
      { path: 'alumno-qr', component: AlumnoQrComponent, data: { roles: ['ADMIN'] } },
      { path: 'docentes', component: DocenteComponent, data: { roles: ['ADMIN'] } },
      { path: 'padres', component: PadreComponent, data: { roles: ['PADRE'] } },
      { path: 'cursos', component: CursoComponent, data: { roles: ['ADMIN'] } },
      { path: 'lector-qr', component: QrScannerComponent, data: { roles: ['ADMIN','DOCENTE'] } },
    ]
  },

  // Ruta comodín
  { path: '**', redirectTo: 'login' }
];