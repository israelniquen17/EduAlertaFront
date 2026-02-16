import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout'; 
import { AlumnoListComponent } from './components/alumno-list/alumno-list';
import { AlumnoFormComponent } from './components/alumno-form/alumno-form';
import { QrScannerComponent } from './components/qr-scanner/qr-scanner';
import { AlumnoQrComponent } from './components/alumno-qr/alumno-qr';
import { DashboardComponent } from './components/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'alumnos', component: AlumnoListComponent },
      { path: 'crear-alumno', component: AlumnoFormComponent },
      { path: 'lector-qr', component: QrScannerComponent },
      { path: 'alumno-qr', component: AlumnoQrComponent }
    ]
  }
];
