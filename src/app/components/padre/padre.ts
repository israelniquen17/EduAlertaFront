import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Alumno {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  grado: string;
  seccion: string;
}

@Component({
  selector: 'app-padre',
  standalone: true,
  templateUrl: './padre.html',
  styleUrls: ['./padre.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class PadreComponent implements OnInit {

  usuario: any = null;
  alumnos: Alumno[] = [];

  constructor() {}

  ngOnInit(): void {
    const data = localStorage.getItem('user');
    this.usuario = data ? JSON.parse(data) : null;

    // 🔹 Simulación de alumnos del padre (en la práctica se trae del backend)
    this.alumnos = [
      { id: 1, dni: '12345678', nombres: 'Juan', apellidos: 'Pérez', grado: '5', seccion: 'A' },
      { id: 2, dni: '87654321', nombres: 'María', apellidos: 'Gonzales', grado: '3', seccion: 'B' }
    ];
  }

}