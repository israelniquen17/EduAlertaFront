import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface AlumnoAsistencia {
  dni: string;
  nombre: string;
  grado: string;
  seccion: string;
  estado: string;
  horaIngreso: string;
}

interface Usuario {
  id: number;
  usuario: string;
  rol: 'ADMIN' | 'DOCENTE';
  estado: 'ACTIVO' | 'INACTIVO';
}

@Component({
  selector: 'app-dashboard',
  standalone: true, // 🔥 FALTABA ESTO
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {

  usuarioLogueado!: Usuario | null;

  totalAlumnos: number = 450;
  presentes: number = 380;
  ausentes: number = 50;
  tardanzas: number = 20;

  asistenciasHoy: AlumnoAsistencia[] = [];
  alertas: string[] = [];

  ngOnInit(): void {
    this.obtenerUsuario();
    this.cargarDatos();
  }

  obtenerUsuario() {
    const data = localStorage.getItem('user');
    if (data) {
      this.usuarioLogueado = JSON.parse(data);
    }
  }

  cargarDatos() {
    this.asistenciasHoy = [
      {
        dni: '12345678',
        nombre: 'Juan Pérez',
        grado: '5to',
        seccion: 'A',
        estado: 'Presente',
        horaIngreso: '07:45 AM'
      },
      {
        dni: '87654321',
        nombre: 'María López',
        grado: '4to',
        seccion: 'B',
        estado: 'Tardanza',
        horaIngreso: '08:15 AM'
      }
    ];

    this.alertas = [
      'Alumno con más de 3 inasistencias',
      '5 alumnos no registraron ingreso hoy',
      '2 alumnos con tardanza recurrente'
    ];
  }

}