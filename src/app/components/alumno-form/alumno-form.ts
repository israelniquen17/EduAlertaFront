import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { AlumnoService } from '../../app/services/alumno.service';

@Component({
  selector: 'app-alumno-form',
  standalone: true,
  templateUrl: './alumno-form.html',
  styleUrls: ['./alumno-form.css'],
  imports: [CommonModule, FormsModule, QRCodeComponent]
})
export class AlumnoFormComponent implements OnInit {

  alumno: any = {
    dni: '',
    nombres: '',
    apellidos: '',
    grado: '',
    seccion: '',
    curso: '',
    docente: '',
    padre: ''
  };

  grados: string[] = ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto'];
  secciones: string[] = ['A', 'B', 'C', 'D'];
  cursos: string[] = ['Matemática', 'Lenguaje', 'Ciencias', 'Historia'];
  docentes: string[] = []; // cargar desde API
  padres: string[] = [];   // cargar desde API

  esAdministrador: boolean = false;

  constructor(private alumnoService: AlumnoService) {}

  ngOnInit(): void {
    const tipoUsuario = localStorage.getItem('tipoUsuario'); // ejemplo
    this.esAdministrador = tipoUsuario === 'ADMIN';

    if (this.esAdministrador) {
      // 🔹 Aquí podrías traer docentes y padres desde tu backend
      // Ejemplo:
      // this.docenteService.obtenerDocentes().subscribe(data => this.docentes = data);
      // this.padreService.obtenerPadres().subscribe(data => this.padres = data);
    }
  }

  get qrData(): string {
    return JSON.stringify(this.alumno);
  }

  guardar() {
    this.alumnoService.crearAlumno(this.alumno)
      .subscribe(() => {
        alert('Alumno registrado correctamente');
      });
  }
}