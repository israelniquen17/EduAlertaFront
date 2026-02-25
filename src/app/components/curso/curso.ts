import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Curso {
  id?: number;
  nombre: string;
  grado: string;
  seccion: string;
}

@Component({
  selector: 'app-curso',
  standalone:true,
  templateUrl: './curso.html',
  styleUrls: ['./curso.css'],  
  imports:[CommonModule,FormsModule]
})
export class CursoComponent implements OnInit {

  cursos: Curso[] = [];
  nuevoCurso: Curso = { nombre: '', grado: '', seccion: '' };
  modoEdicion = false;
  mensajeError = '';

  apiUrl = 'http://localhost:8080/api/cursos';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listarCursos();
  }

  listarCursos() {
    this.http.get<Curso[]>(this.apiUrl).subscribe({
      next: data => {
        this.cursos = data;
        this.mensajeError = '';
        this.cdr.detectChanges(); // 🔹 fuerza renderizado inmediato
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al listar cursos', err);
        this.mensajeError = 'No se pudo cargar la lista de cursos.';
      }
    });
  }

  guardarCurso() {
    if (!this.nuevoCurso.nombre || !this.nuevoCurso.grado || !this.nuevoCurso.seccion) {
      alert('Completa todos los campos');
      return;
    }

    if (this.modoEdicion && this.nuevoCurso.id) {
      this.http.put<Curso>(`${this.apiUrl}/${this.nuevoCurso.id}`, this.nuevoCurso).subscribe({
        next: () => {
          this.listarCursos();
          this.nuevoCurso = { nombre: '', grado: '', seccion: '' };
          this.modoEdicion = false;
          this.mensajeError = '';
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al actualizar curso', err);
          this.mensajeError = 'No se pudo actualizar el curso.';
        }
      });
    } else {
      this.http.post<Curso>(this.apiUrl, this.nuevoCurso).subscribe({
        next: data => {
          this.cursos.push(data);
          this.nuevoCurso = { nombre: '', grado: '', seccion: '' };
          this.mensajeError = '';
          this.cdr.detectChanges(); // 🔹 actualiza la tabla inmediatamente
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al agregar curso', err);
          this.mensajeError = 'No se pudo agregar el curso.';
        }
      });
    }
  }

  editarCurso(curso: Curso) {
    this.nuevoCurso = { ...curso };
    this.modoEdicion = true;
  }

  eliminarCurso(id?: number) {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este curso?')) return;

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.listarCursos(),
      error: (err: HttpErrorResponse) => {
        console.error('Error al eliminar curso', err);
        this.mensajeError = 'No se pudo eliminar el curso.';
      }
    });
  }
}