import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Nivel {
  id: number;
  nombre: string;
}

interface Curso {
  id?: number;
  nombre: string;
  nivel: Nivel | null;
  grado: string;
  seccion: string;
}

@Component({
  selector: 'app-curso',
  standalone: true,
  templateUrl: './curso.html',
  styleUrls: ['./curso.css'],
  imports: [CommonModule, FormsModule]
})
export class CursoComponent implements OnInit {

  cursos: Curso[] = [];
  niveles: Nivel[] = [];

  gradosInicial = ['3 años', '4 años', '5 años'];
  gradosPrimaria = ['1ro', '2do', '3ro', '4to', '5to', '6to'];
  gradosSecundaria = ['1ro', '2do', '3ro', '4to', '5to'];
  secciones = ['A', 'B', 'C', 'D'];
  gradosDisponibles: string[] = [];

  nuevoCurso: Curso = {
    nombre: '',
    nivel: null,
    grado: '',
    seccion: ''
  };

  modoEdicion = false;
  mensajeError = '';
  mensajeOk = '';

  apiUrl = 'http://localhost:8080/api/cursos';
  apiNivelUrl = 'http://localhost:8080/api/niveles';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.listarCursos();
    this.listarNiveles();
  }

listarCursos() {
  this.http.get<Curso[]>(this.apiUrl).subscribe({
    next: data => {
      console.log('Cursos cargados:', data);
      this.cursos = data;
      this.mensajeError = '';
      this.cdr.detectChanges();
    },
    error: (err: HttpErrorResponse) => {
      console.error('Error al listar cursos:', err);
      this.mensajeError = err.error?.message || err.error?.mensaje || 'No se pudo cargar cursos';
    }
  });
}

listarNiveles() {
  this.http.get<Nivel[]>(this.apiNivelUrl).subscribe({
    next: data => {
      console.log('Niveles cargados:', data);
      this.niveles = data;
    },
    error: (err: HttpErrorResponse) => {
      console.error('Error al listar niveles:', err);
      this.mensajeError = err.error?.message || err.error?.mensaje || 'No se pudo cargar niveles';
    }
  });
}

  actualizarGrados() {
    const nivelId = Number(this.nuevoCurso.nivel?.id);

    if (nivelId === 1) {
      this.gradosDisponibles = [...this.gradosInicial];
    } else if (nivelId === 2) {
      this.gradosDisponibles = [...this.gradosPrimaria];
    } else if (nivelId === 3) {
      this.gradosDisponibles = [...this.gradosSecundaria];
    } else {
      this.gradosDisponibles = [];
    }

    if (!this.gradosDisponibles.includes(this.nuevoCurso.grado)) {
      this.nuevoCurso.grado = '';
    }
  }

  guardarCurso() {
    const payload = {
      ...this.nuevoCurso,
      nombre: this.nuevoCurso.nombre.trim(),
      grado: this.nuevoCurso.grado.trim(),
      seccion: this.nuevoCurso.seccion.trim(),
      nivel: this.nuevoCurso.nivel ? { id: this.nuevoCurso.nivel.id } : null
    };

    if (!payload.nombre || !payload.nivel || !payload.grado || !payload.seccion) {
      this.mensajeError = 'Completa todos los campos';
      return;
    }

    this.mensajeError = '';
    this.mensajeOk = '';

    if (this.modoEdicion && this.nuevoCurso.id) {
      this.http.put<Curso>(`${this.apiUrl}/${this.nuevoCurso.id}`, payload).subscribe({
        next: () => {
          this.listarCursos();
          this.resetFormulario();
          this.mensajeOk = 'Curso actualizado correctamente';
        },
        error: (err: HttpErrorResponse) => {
          this.mensajeError = err.error?.message || err.error?.mensaje || 'No se pudo actualizar el curso';
        }
      });
    } else {
      this.http.post<Curso>(this.apiUrl, payload).subscribe({
        next: () => {
          this.listarCursos();
          this.resetFormulario();
          this.mensajeOk = 'Curso registrado correctamente';
        },
        error: (err: HttpErrorResponse) => {
          this.mensajeError = err.error?.message || err.error?.mensaje || 'No se pudo registrar el curso';
        }
      });
    }
  }

  editarCurso(curso: Curso) {
    this.nuevoCurso = {
      ...curso,
      nivel: curso.nivel ? { ...curso.nivel } : null
    };
    this.actualizarGrados();
    this.modoEdicion = true;
  }

  eliminarCurso(id?: number) {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este curso?')) return;

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.listarCursos();
        this.mensajeOk = 'Curso eliminado correctamente';
      },
      error: () => this.mensajeError = 'No se pudo eliminar el curso'
    });
  }

  resetFormulario() {
    this.nuevoCurso = {
      nombre: '',
      nivel: null,
      grado: '',
      seccion: ''
    };
    this.gradosDisponibles = [];
    this.modoEdicion = false;
    this.mensajeError = '';
  }
}