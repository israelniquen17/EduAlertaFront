import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlumnoService, Alumno } from '../../app/services/alumno.service';

@Component({
  selector: 'app-alumno-list',
  standalone: true,
  templateUrl: './alumno-list.html',
  styleUrls: ['./alumno-list.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class AlumnoListComponent implements OnInit {

  filtro: string = '';
  alumnos: Alumno[] = [];
  alumnosFiltrados: Alumno[] = [];

  alumnoSeleccionado: Alumno | null = null;
  mostrarModal: boolean = false;

  constructor(private alumnoService: AlumnoService) {}

  ngOnInit(): void {

    // 🔥 Se suscribe automáticamente a los cambios
    this.alumnoService.alumnos$.subscribe(data => {
      this.alumnos = data;
      this.alumnosFiltrados = data;
    });

    // 🔥 Carga inicial
    this.alumnoService.obtenerAlumnos().subscribe();
  }

  filtrarAlumnos() {
    const texto = this.filtro.toLowerCase();

    this.alumnosFiltrados = this.alumnos.filter(a =>
      a.nombres.toLowerCase().includes(texto) ||
      a.apellidos.toLowerCase().includes(texto) ||
      a.dni.includes(texto)
    );
  }

  eliminarAlumno(id?: number) {

    if (!id) return;

    if (!confirm('¿Seguro que deseas eliminar este alumno?')) {
      return;
    }

    this.alumnoService.eliminarAlumno(id)
      .subscribe(() => {
        alert('Alumno eliminado correctamente');
      });
  }

  abrirModal(alumno: Alumno) {
    this.alumnoSeleccionado = { ...alumno };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.alumnoSeleccionado = null;
  }

  guardarCambios() {

    if (!this.alumnoSeleccionado?.id) return;

    this.alumnoService.actualizarAlumno(
      this.alumnoSeleccionado.id,
      this.alumnoSeleccionado
    ).subscribe(() => {

      alert('Alumno actualizado correctamente');
      this.cerrarModal();
    });
  }
}