import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout'; 
import { AlumnoListComponent } from './components/alumno-list/alumno-list';
import { AlumnoFormComponent } from './components/alumno-form/alumno-form';
import { QrScannerComponent } from './components/qr-scanner/qr-scanner';
import { AlumnoQrComponent } from './components/alumno-qr/alumno-qr';
import { DashboardComponent } from './components/dashboard/dashboard';
import { Login } from './components/login/login';
import { authGuard } from './auth.guard'
import { DocenteComponent } from './components/docente/docente';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],   // 🔥 PROTEGE TODO EL SISTEMA
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'alumnos', component: AlumnoListComponent },
      { path: 'docente', component: DocenteComponent },
      { path: 'crear-alumno', component: AlumnoFormComponent },
      { path: 'editar-alumno/:id', component: AlumnoFormComponent }, // 🔥 MOVIDO AQUÍ
      { path: 'lector-qr', component: QrScannerComponent },
      { path: 'alumno-qr', component: AlumnoQrComponent },
    ]
  },

  { path: '**', redirectTo: 'login' }
];