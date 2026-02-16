import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Alumno {
  dni: string;
  nombres: string;
  apellidos: string;
  grado: string;
  seccion: string;
  estado: string;
}

@Component({
  selector: 'app-alumno-list',
  standalone: true,
  templateUrl: './alumno-list.html',
  styleUrls: ['./alumno-list.css'],
  imports: [CommonModule, FormsModule]
})
export class AlumnoListComponent {

  filtro: string = '';

  alumnos: Alumno[] = [
    {
      dni: '12345678',
      nombres: 'Juan',
      apellidos: 'Pérez',
      grado: '5°',
      seccion: 'A',
      estado: 'Activo'
    },
    {
      dni: '87654321',
      nombres: 'María',
      apellidos: 'López',
      grado: '4°',
      seccion: 'B',
      estado: 'Activo'
    }
  ];

  alumnosFiltrados: Alumno[] = [...this.alumnos];

  filtrarAlumnos() {
    const texto = this.filtro.toLowerCase();

    this.alumnosFiltrados = this.alumnos.filter(a =>
      a.nombres.toLowerCase().includes(texto) ||
      a.apellidos.toLowerCase().includes(texto) ||
      a.dni.includes(texto)
    );
  }

}
